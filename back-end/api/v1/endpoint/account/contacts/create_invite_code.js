const fs = require('fs');
const base64Img = require('base64-img');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/contacts/create_invite_code'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/acounts/contacts/create_invite_code'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': createInviteCode // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function createInviteCode(http_request, response){
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
  
  /***************** Update Main Account *******************/
  var main_account_params;
  do {
    // Invite Code
    var inviteCode = libs.cryptography.random_string(6);
    
    // Invite Code Exp Date
    var inviteCodeED = new Date();
    // + 1 day
    inviteCodeED.setDate(inviteCodeED.getDate() + 1);
    
    main_account_params = {
      account_invite_code: inviteCode,
      account_invite_code_ed: inviteCodeED
    }
    let main_account_update = await models.queries.update_table('main_accounts', main_account_params, {main_account_address: Account.main_account_address});
    if(!main_account_update.done){
      if(main_account_update.code != 405.2) {
        resp = libs.response.setup(resp, `${main_account_update.code}-3`);
        response.status(200);
        response.json(resp);
        return
      }
    } else break;
  } while(true) 

  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'Invite code has been created successfully.';
  resp.result = [main_account_params];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
