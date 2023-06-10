const fs = require('fs');
const base64Img = require('base64-img');
const { Wallet } = require('ethers');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/wallets'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/wallets'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getAccountWallets // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: WALLETS ******************************/
async function getAccountWallets(http_request, response){
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

  if(Account.account_status != 'main') {
    resp = libs.response.setup(resp, '402.2-0');
    response.status(200);
    response.json(resp);
    return
  }

  /***************** Get Wallets *******************/
  let dbWallets = await models.queries.select_table('accounts', {main_account_address: Account.account_address});
  if(!dbWallets.done){
    resp = libs.response.setup(resp, `${dbWallets.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Wallets = dbWallets.data;
  
  let LinkedAccounts = [];
  let WaitingAccounts = [];
  Wallets.forEach(wallet => {
    if(wallet.account_status == 'linked') {
      LinkedAccounts.push(wallet.account_address)
    }
    if(wallet.account_status == 'waiting') {
      WaitingAccounts.push(wallet.account_address)
    }
  });

  let result = {
    account_address: Account.account_address,
    account_status: Account.account_status,
    main_account_address: Account.main_account_address,
    linked_accounts: LinkedAccounts.length ? LinkedAccounts : null,
    waiting_accounts: WaitingAccounts.length ? WaitingAccounts : null,
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
