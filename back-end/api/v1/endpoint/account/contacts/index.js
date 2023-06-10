const fs = require('fs');
const base64Img = require('base64-img');
const { Wallet } = require('ethers');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/contacts'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/contacts'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getAccountContacts // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: CONTACTS ******************************/
async function getAccountContacts(http_request, response){
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
      account_image_url: main_account.account_image_url
    }
  }

  /***************** Get Contacts *******************/
  let where_params = {
    main_account_address: Account.main_account_address
  }
  let dbContacts = await models.queries.select_table('contacts', where_params);
  if(!dbContacts.done){
    resp = libs.response.setup(resp, `${dbContacts.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Contacts = dbContacts.data || [];
  var accountContacts = {
    connected: null,
    waiting: null,
    rejected: null,
    blocked: null,
    waiting_friends: null,
  };
  for(let contact of Contacts) {
    if(contact.contact_account_address in MainAccountsMakeup) {
      let contactAccount = MainAccountsMakeup[contact.contact_account_address]
      contactAccount['contact_id'] = contact.contact_id;
      // contactAccount['contact_status'] = contact.contact_status;
      contactAccount['created_at'] = contact.created_at;
      contactAccount['updated_at'] = contact.created_at;
      
      if(!accountContacts[contact.contact_status]) accountContacts[contact.contact_status] = [];
      accountContacts[contact.contact_status].push(contactAccount);
    }
  }

  /***************** Get Account In Friends Contacts *******************/
  where_params = {
    contact_account_address: Account.main_account_address,
    contact_status: 'waiting'
  }
  let dbWaitingFriends = await models.queries.select_table('contacts', where_params);
  if(!dbWaitingFriends.done){
    resp = libs.response.setup(resp, `${dbWaitingFriends.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const WaitingFriends = dbWaitingFriends.data || [];
  for(let contact of WaitingFriends) {
    if(contact.main_account_address in MainAccountsMakeup) {
      let contactAccount = MainAccountsMakeup[contact.main_account_address]
      contactAccount['contact_id'] = contact.contact_id;
      // contactAccount['contact_status'] = contact.contact_status;
      contactAccount['created_at'] = contact.created_at;
      contactAccount['updated_at'] = contact.created_at;
      
      if(!accountContacts.waiting_friends) accountContacts.waiting_friends = [];
      accountContacts.waiting_friends.push(contactAccount);
    }
  }

  // console.log(accountContacts);
  // All is done.
  resp = libs.response.setup(resp, '200.1-1');
  resp.result = [accountContacts];
  response.status(200);
  response.json(resp);
  return
}
   
module.exports = new leaf();
