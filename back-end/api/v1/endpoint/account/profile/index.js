const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/profile'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/profile'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getAccountProfile // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: Account PROFILE ******************************/
/************* Reset New Verification Code And Send Again *************/
async function getAccountProfile(http_request, response){
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
    let response_id = `${connected_account.status_code}-1`;
    resp = libs.response.setup(resp, response_id);
    response.status(200);
    response.json(resp);
    return
  }
  const Account = connected_account.result;

  /***************** Get Main Account *******************/
  var MainAccount = null;
  var CirclesNumber = 0;
  var ContactsNumber = 0;
  
  if(Account.main_account_address && Account.account_status != 'waiting') {
    let main_account = await models.queries.select_table('main_accounts', {main_account_address: Account.main_account_address});
    if(!main_account.done || !main_account.data) {
      resp = libs.response.setup(resp, `${main_account.code}-2`);
      response.status(200);
      response.json(resp);
      return
    }
    MainAccount = main_account.data[0];

    /***************** Get Circles *******************/
    let dbCircles = await models.queries.select_table('circles', {circle_creator_main: Account.main_account_address});
    if(!dbCircles.done) {
      resp = libs.response.setup(resp, `${dbCircles.code}-2`);
      response.status(200);
      response.json(resp);
      return
    }
    CirclesNumber = dbCircles.data ? dbCircles.data.length : 0;
    
    /***************** Get Contacts *******************/
    let dbContacts = await models.queries.select_table('contacts', {main_account_address: Account.main_account_address, contact_status: 'connected'});
    if(!dbContacts.done) {
      resp = libs.response.setup(resp, `${dbContacts.code}-3`);
      response.status(200);
      response.json(resp);
      return
    }
    ContactsNumber = dbContacts.data ? dbContacts.data.length : 0;
  }

  const result = MainAccount ? {
    account_address: MainAccount.main_account_address,
    account_image_url: MainAccount.account_image_url,
    account_fullname: MainAccount.account_fullname,
    account_username: MainAccount.account_username,
    account_email: MainAccount.account_email,
    account_social_twitter: MainAccount.account_social_twitter,
    account_social_facebook: MainAccount.account_social_facebook,
    account_social_instagram: MainAccount.account_social_instagram,
    account_social_linkedin: MainAccount.account_social_linkedin,
    account_social_telegram: MainAccount.account_social_telegram,
    account_invite_code: MainAccount.account_invite_code,
    account_invite_code_ed: MainAccount.account_invite_code_ed,
    account_circles_number: CirclesNumber,
    account_contacts_number: ContactsNumber
  } : null;
  // console.log(result);
  // All Is Done.
  resp = libs.response.setup(resp, '200.1-1');
  resp.result = [result];
  response.status(200);
  response.json(resp);
  return
}
   
module.exports = new leaf();
