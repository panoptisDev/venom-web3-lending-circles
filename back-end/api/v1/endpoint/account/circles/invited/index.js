const fs = require('fs');
const base64Img = require('base64-img');
const { Wallet } = require('ethers');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/circles/invited'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/circles/invited'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getAccountInvitedCircle // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: CIRCLES ******************************/
async function getAccountInvitedCircle(http_request, response){
  /************* Default Result Schema *************/
  let resp = {
    origin_url: http_request.protocol + '://' + http_request.get('host') + http_request.originalUrl,
    response_id: null,
    status_code: 200,
    done: true,
    message_type: null,
    message: null,
    result: null
  };
  /*
  Method: GET
  Header: Authorization
  */

  /******************* HTTP Request ********************************/
  /************* Verify Account Authorization *************/
  if(!('authorization' in http_request.headers)){
    resp = libs.response.setup(resp, '401.1-0');
    response.status(200);
    response.json(resp);
    return
  }
  let connected_account = await models.accounts.getAccountByAuthTokent(http_request.headers.authorization);
  if(!connected_account.done){
    let response_id = `${connected_account.status_code}-0`;
    resp = libs.response.setup(resp, response_id);
    response.status(200);
    response.json(resp);
    return
  }
  const Account = connected_account.result;

  /***************** Get & Makeup Main Accounts *******************/
  let dbMainAccounts = await models.queries.select_table('main_accounts');
  if(!dbMainAccounts.done || !dbMainAccounts.data){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  var MainAccountsMakeup = {};
  for(let main_account of dbMainAccounts.data) {
    MainAccountsMakeup[main_account.main_account_address] = {
      main_account_address: main_account.main_account_address,
      account_username: main_account.account_username,
      account_email: main_account.account_email,
      account_fullname: main_account.account_fullname,
      account_social_twitter: main_account.account_social_twitter,
      account_social_instagram: main_account.account_social_instagram,
      account_social_linkedin: main_account.account_social_linkedin,
      account_social_telegram: main_account.account_social_telegram,
      account_image_url: main_account.account_image_url,
      account_created_at: main_account.created_at
    }
  }

  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, ['circle_id'], []);
  }catch(e){
    resp = libs.response.setup(resp, '400.2-1');
    resp.result = [e];
    response.status(200);
    response.json(resp);
    return
  }
  if(params.hasErrors){
    resp = libs.response.setup(resp, '400.3-1');
    resp.result = [params.errors];
    response.status(200);
    response.json(resp);
    return
  }

  /***************** Get Account in Circles Whitelists *******************/
  let where_params = {
    circle_id: params.verifiedParams.circle_id,
    whitelist_account_address: Account.main_account_address,
    whitelist_is_alive: true,
    whitelist_is_joined: false,
    whitelist_is_rejected: false
  };
  let dbWhitelists = await models.queries.select_table('circles_whitelists', where_params);
  if(!dbWhitelists.done){
    resp = libs.response.setup(resp, `${dbWhitelists.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  if(!dbWhitelists.data){
    resp = libs.response.setup(resp, '404.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  const Invite = dbWhitelists.data[0];

  /***************** Get Circle *******************/
  let dbCircles = await models.queries.select_table('circles', {circle_id: params.verifiedParams.circle_id});
  if(!dbCircles.done){
    resp = libs.response.setup(resp, `${dbCircles.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  if(!dbCircles.data){
    resp = libs.response.setup(resp, '404.1-2');
    response.status(200);
    response.json(resp);
    return
  }
  const Circle = dbCircles.data[0];
  
  /***************** Get Circle Members *******************/
  let dbMembers = await models.queries.select_table('circles_members',
    {
      circle_id: params.verifiedParams.circle_id,
      member_status: 'joined'
    }, null, ['member_selected_round', 'desc'], ['created_at', 'desc']);
  if(!dbMembers.done){
    resp = libs.response.setup(resp, `${dbMembers.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Members = dbMembers.data || [];
  var memberList = Array.from({length: Circle.circle_max_members}, () => ({}));
  
  let i = 0;
  
  for(let member of Members) {
    if(member.main_account_address in MainAccountsMakeup) {
      const memberAccount = {...MainAccountsMakeup[member.main_account_address]}
      memberAccount['member_id'] = member.member_account_address;
      memberAccount['main_account_address'] = member.main_account_address;
      memberAccount['member_account_address'] = member.member_account_address;
      memberAccount['member_is_moderator'] = member.member_is_moderator;
      memberAccount['member_selected_round'] = member.member_selected_round;
      memberAccount['member_status'] = member.member_status;
      memberAccount['created_at'] = member.created_at;
      if(Circle.circle_winners_order == 'fixed') {
        memberList[member.member_selected_round] = memberAccount;
      } else {
        memberList[i++] = memberAccount;
      }
    }
  }

  let result = {
    ...Circle,
    circle_creator: {...MainAccountsMakeup[Circle.circle_creator_main]},
    circle_total_members: Members.length,
    circle_members: memberList
  }

  // console.log(result);
  // All is done.
  resp = libs.response.setup(resp, '200.1-1');
  resp.result = [result];
  response.status(200);
  response.json(resp);
  return
}
   
module.exports = new leaf();
