const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/connect'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/connect'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': accountConnect // Setting for each http method a function
    };
  }
}

async function accountConnect(http_request, response){
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
  
  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, ['account_address'], []);
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

  var Account;

  /************* Check Address Exists Or Not *************/
  let dbAccount = await models.queries.select_table('accounts', {account_address: params.verifiedParams.account_address});
  if(!dbAccount.done){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  // Exist Account
  if(dbAccount.data && dbAccount.data.length) {
    let updatedAccount = await models.queries.update_table('accounts', {last_connect: new Date()}, {account_address: params.verifiedParams.account_address});
    if(!updatedAccount.done || !updatedAccount.data){
      resp = libs.response.setup(resp, '500.1-2');
      response.status(200);
      response.json(resp);
      return
    }
    Account = updatedAccount.data[0];
  // Fresh Account
  } else {
    let freshAccount = await models.queries.insert_table('accounts', {account_address: params.verifiedParams.account_address});
    if(!freshAccount.done || !freshAccount.data){
      resp = libs.response.setup(resp, '500.1-4');
      response.status(200);
      response.json(resp);
      return
    }
    Account = freshAccount.data;
  }
  
  /************* Setting JWT Token To Account *************/
  let token_data = {
    account_id: Account.id,
    account_address: Account.account_address,
    main_account_address: Account.main_account_address,
    last_connect: Account.last_connect
  }
  const expirationTimeInMinutes = 24 * 60; // One Day
  let jwtToken = libs.cryptography.jwt_sign_data(token_data, `${expirationTimeInMinutes}m`);
  if(!jwtToken){
    resp = libs.response.setup(resp, '500.1-5');
    response.status(200);
    response.json(resp);
    return
  }

  /************************* Login User *******************************/
  //insert user_logins
  /*
  */

  /************************* Insert Sign_up Messages *******************************/
  /*
  */

  /************************* Send Response *******************************/
  const result = {
    account_address: Account.account_address,
    account_status: Account.account_status,
    main_account_address: Account.main_account_address,
    access_token: jwtToken,
    last_connect: Account.last_connect.getTime(),
    expiration_date: Account.last_connect.getTime() + (expirationTimeInMinutes * 60000)
  }
  // console.log(result);
  // All Is Done.
  resp = libs.response.setup(resp, '200.2-1');
  resp.result = [result];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
