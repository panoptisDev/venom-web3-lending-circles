const fs = require('fs');
const base64Img = require('base64-img');
const { Wallet } = require('ethers');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/profile/_circles'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/profile/_circles'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getAccountProfileCircles // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: CIRCLES ******************************/
async function getAccountProfileCircles(http_request, response){
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
      account_image_url: main_account.account_image_url
    }
  }

  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, [], ['circle_id']);
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

  /***************** Get Circles *******************/
  let where_params = null
  if(params.verifiedParams.circle_id) {
    where_params = {circle_id: params.verifiedParams.circle_id};
  }
  let dbCircles = await models.queries.select_table('circles', where_params);
  if(!dbCircles.done){
    resp = libs.response.setup(resp, `${dbCircles.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }

  var Circles = null;
  var result = null;
  if(params.verifiedParams.circle_id) {
    if(!dbCircles.data){
      resp = libs.response.setup(resp, '404.1-1');
      response.status(200);
      response.json(resp);
      return
    }
    result = dbCircles.data[0];
  } else {

    /***************** Get & Makeup Circles *******************/
    var CirclesMakeup = {};
    for(let circle of dbCircles.data || []) {
      if(circle.circle_creator_main in MainAccountsMakeup) {
        circle['circle_creator'] = MainAccountsMakeup[circle.circle_creator_main]
      }
      CirclesMakeup[circle.circle_id] = circle;
    }
  
    /***************** Get Account in Circles Whitelists *******************/
    let dbWhitelists = await models.queries.select_table('circles_whitelists', {
      whitelist_account_address: Account.main_account_address,
      whitelist_is_alive: true,
      whitelist_is_joined: false,
      whitelist_is_rejected: false
    });
    if(!dbWhitelists.done){
      resp = libs.response.setup(resp, `${dbWhitelists.code}-2`);
      response.status(200);
      response.json(resp);
      return
    }
    const Whitelists = dbWhitelists.data || [];
    for(let invite of Whitelists) {
      if(invite.circle_id in CirclesMakeup) {
        CirclesMakeup[invite.circle_id]['account_role'] = 'invited';
        if(!Circles) Circles = [];
        Circles.push(CirclesMakeup[invite.circle_id]);
      }
    }
    
    /***************** Get Account in Circles Members *******************/
    let dbMembers = await models.queries.select_table('circles_members', {
      main_account_address: Account.main_account_address,
      member_status: 'joined'
    });
    if(!dbMembers.done){
      resp = libs.response.setup(resp, `${dbMembers.code}-1`);
      response.status(200);
      response.json(resp);
      return
    }
    const Members = dbMembers.data || [];
    for(let member of Members) {
      if(member.circle_id in CirclesMakeup) {
        if(CirclesMakeup[member.circle_id].circle_creator_main != Account.main_account_address) {
          CirclesMakeup[member.circle_id]['account_role'] = 'joined';
          if(!Circles) Circles = [];
          Circles.push(CirclesMakeup[member.circle_id]);
        }
      }
    }
    
    /***************** Get Account Circles Members & Whitelists *******************/
    result = Circles && Circles.length ? [] : null;
    if(result) {
      for(let circle of Circles) {
        let dbCircleMembers = await models.queries.select_table('circles_members', {
          circle_id: circle.circle_id,
          member_status: 'joined'
        });
        if(!dbCircleMembers.done){
          resp = libs.response.setup(resp, `${dbCircleMembers.code}-3`);
          response.status(200);
          response.json(resp);
          return
        }
        let circlesMembers = [];
        for(let member of dbCircleMembers.data || []) {
          if(member.main_account_address in MainAccountsMakeup) {
            circlesMembers.push({
              member_id: member.member_id,
              main_account_address: member.main_account_address,
              member_account_address: member.member_account_address,
              member_is_moderator: member.member_is_moderator,
              member_status: member.member_status,
              ...MainAccountsMakeup[member.main_account_address]})
          }
        }
        circle['circle_members'] = circlesMembers;
        // let dbCircleInvites = await models.queries.select_table('circles_whitelists', {circle_id: circle.circle_id});
        // if(!dbCircleInvites.done){
        //   resp = libs.response.setup(resp, `${dbCircleInvites.code}-3`);
        //   response.status(200);
        //   response.json(resp);
        //   return
        // }
        // circle['invites'] = dbCircleInvites.data;
        result.push(circle);
      }
    }
  
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
