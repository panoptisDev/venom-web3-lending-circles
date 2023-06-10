const fs = require('fs');
const base64Img = require('base64-img');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/contacts/accept_waiting_contact'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/acounts/contacts/accept_waiting_contact'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': acceptWaitingContact // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function acceptWaitingContact(http_request, response){
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
    var params = libs.validations.validate_request_params(http_request, ['contact_id'], []);
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

  /***************** Update Contacts *******************/
  let where_params = {
    contact_id: params.verifiedParams.contact_id,
    contact_account_address: Account.main_account_address,
    contact_status: 'waiting'
  }
  let contacts_update = await models.queries.update_table('contacts', {contact_trust_level: 1, contact_status: 'connected'}, where_params);
  if(!contacts_update.done && !contacts_update.data){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  const Contact = contacts_update.data[0];
 
  /***************** Insert Contacts *******************/
  // generate contact_id
  let contact_id = {
    account_address: Account.account_address,
    main_account_address: Account.main_account_address,
    contact_account_address: Contact.main_account_address,
    created_at: new Date().getTime(),
    random_token: libs.cryptography.random_token(10)
  };
  const contactId = libs.cryptography.hash_md5(JSON.stringify(contact_id));

  let contact_params = {
    contact_id: contactId,
    main_account_address: Account.main_account_address,
    contact_account_address: Contact.main_account_address,
    contact_trust_level: 1,
    contact_status: 'connected'
  }
  let contacts_insert = await models.queries.insert_table('contacts', contact_params);
  if(!contacts_insert.done){
    resp = libs.response.setup(resp, `${contacts_insert.code}-3`);
    response.status(200);
    response.json(resp);
    return
  }

  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'Friend request successfully accepted.';
  // resp.result = [contact_params];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
