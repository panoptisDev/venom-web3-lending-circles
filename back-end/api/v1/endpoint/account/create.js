const fs = require('fs');
const base64Img = require('base64-img');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/create'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/create'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': createAccount // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function createAccount(http_request, response){
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
    var params = libs.validations.validate_request_params(http_request, ['account_username', 'account_email'], []);
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

  /***************** Insert Main Account *******************/
  let main_account_params = {
    main_account_address: Account.account_address,
    account_username: params.verifiedParams.account_username,
    account_email: params.verifiedParams.account_email
  }
  let main_account_insert = await models.queries.insert_table('main_accounts', main_account_params);
  if(!main_account_insert.done){
    resp = libs.response.setup(resp, `${main_account_insert.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }

  /***************** Update Account *******************/
  let account_params = {
    account_status: 'main',
    main_account_address: Account.account_address
  }
  let account_update = await models.queries.update_table('accounts', account_params, {id: Account.id});
  if(!account_update.done){
    resp = libs.response.setup(resp, `${account_update.code}-4`);
    response.status(200);
    response.json(resp);
    return
  }


  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'Account profile has been created successfully.';
  resp.result = [main_account_params];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
