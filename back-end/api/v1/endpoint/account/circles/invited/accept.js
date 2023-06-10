const fs = require('fs');
const base64Img = require('base64-img');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/circles/invited/accept'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/circles/invited/accept'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': acceptCircleInvite // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function acceptCircleInvite(http_request, response){
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
    let response_id = `${connected_account.status_code}-1`;
    resp = libs.response.setup(resp, response_id);
    response.status(200);
    response.json(resp);
    return
  }
  const Account = connected_account.result;
  
  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request,
      [
        'circle_id',
        'member_selected_round'
      ], []);
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

  /************* Get Circle *************/
  let dbCircle = await models.queries.select_table('circles', {circle_id: params.verifiedParams.circle_id});
  if(!dbCircle.done || !dbCircle.data) {
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  const Circle = dbCircle.data[0];

  /***************** Get Circle Members In Selected Round *******************/
  if(Circle.circle_winners_order == 'fixed') {
    let where_params = {
      circle_id: Circle.circle_id,
      member_status: 'joined',
      member_selected_round: params.verifiedParams.member_selected_round
    }
    let dbMembers = await models.queries.select_table('circles_members', where_params);
    if(!dbMembers.done) {
      resp = libs.response.setup(resp, `${dbMembers.code}-3`);
      response.status(200);
      response.json(resp);
      return
    }
    if(dbMembers.data && dbMembers.data.length >= Circle.circle_winners_number) {
      resp = libs.response.setup(resp, '411.3-1');
      response.status(200);
      response.json(resp);
      return
    }
  }

  /***************** Update Circle Whitelists *******************/
  let invites_update = await models.queries.update_table('circles_whitelists',
    {
      whitelist_is_joined: true
    }, 
    {
      circle_id: Circle.circle_id,
      whitelist_account_address: Account.main_account_address,
      whitelist_is_alive: true,
      whitelist_is_joined: false,
      whitelist_is_rejected: false
    }
  );
  if(!invites_update.done || !invites_update.data){
    resp = libs.response.setup(resp, '500.1-2');
    response.status(200);
    response.json(resp);
    return
  }
  
  /***************** Insert Circle Members *******************/
  // generate member_id
  let member_id = {
    account_address: Account.account_address,
    circle_id: Circle.circle_id,
    created_at: new Date().getTime(),
    random_token: libs.cryptography.random_token(10)
  };
  const memberId = libs.cryptography.hash_md5(JSON.stringify(member_id));

  let member_params = {
    member_id: memberId,
    circle_id: Circle.circle_id,
    main_account_address: Account.main_account_address,
    member_account_address: Account.account_address,
    member_is_moderator: false,
    member_selected_round: params.verifiedParams.member_selected_round,
    member_status: 'joined'
  }
  let members_insert = await models.queries.insert_table('circles_members', member_params);
  if(!members_insert.done){
    resp = libs.response.setup(resp, `${members_insert.code}-3`);
    response.status(200);
    response.json(resp);
    return
  }

  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'You have joined to the circle successfully.';
  resp.result = [];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
