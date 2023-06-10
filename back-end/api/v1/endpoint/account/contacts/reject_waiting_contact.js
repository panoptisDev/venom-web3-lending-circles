const fs = require('fs');
const base64Img = require('base64-img');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor() {
    this.__uri__ = '/account/contacts/reject_waiting_contact'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/acounts/contacts/reject_waiting_contact'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': rejectWaitingContact // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function rejectWaitingContact(http_request, response) {
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
  if(!('authorization' in http_request.headers)) {
    resp = libs.response.setup(resp, '401.1-0');
    response.status(200);
    response.json(resp);
    return
  }
  let connected_account = await models.accounts.getAccountByAuthTokent(http_request.headers.authorization);
  if(!connected_account.done) {
    let response_id = `${connected_account.status_code}-1`;
    resp = libs.response.setup(resp, response_id);
    response.status(200);
    response.json(resp);
    return
  }
  const Account = connected_account.result;
  
  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, ['contact_id'], []);
  }catch(e) {
    resp = libs.response.setup(resp, '400.2-1');
    resp.result = [e];
    response.status(200);
    response.json(resp);
    return
  }
  if(params.hasErrors) {
    resp = libs.response.setup(resp, '400.3-1');
    resp.result = [params.errors];
    response.status(200);
    response.json(resp);
    return
  }

  /***************** Update Contacts *******************/
  let where_params = {
    contact_id: params.verifiedParams.contact_id,
    contact_account_address: Account.main_account_address,
    contact_status: 'waiting'
  }
  let contacts_update = await models.queries.update_table('contacts', {contact_status: 'rejected'}, where_params);
  if(!contacts_update.done) {
    resp = libs.response.setup(resp, `${contacts_update.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
 
  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'Friend request successfully rejected.';
  // resp.result = [contact_params];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
