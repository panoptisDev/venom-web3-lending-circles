const fs = require('fs');
const base64Img = require('base64-img');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/link/cancel'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/link_cancel'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': linkCancel // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function linkCancel(http_request, response){
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
  
  /***************** Update Account *******************/
  let account_params = {
    account_status: 'fresh',
    main_account_address: null
  }
  let account_update = await models.queries.update_table('accounts', account_params, {id: Account.id});
  if(!account_update.done){
    resp = libs.response.setup(resp, `${account_update.code}-3`);
    response.status(200);
    response.json(resp);
    return
  }


  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'The link request was successfully canceled.';
  resp.result = [];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
