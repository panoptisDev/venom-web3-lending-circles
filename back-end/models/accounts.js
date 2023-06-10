const libs = require.main.require('./libs');
const queries = require('./queries');

let resp = {
  status_code: 200,
  done: true,
  result: [],
  message: null
}

/*********************** Get Connected Account Data ********************************/
async function getAccountByAuthTokent(authorizationToken){
  /* ------------------- Verify JWT Token ------------------- */
  var pureToken = libs.cryptography.get_pure_token(authorizationToken);
  var accountData = libs.cryptography.jwt_verify_token(pureToken);
  if(!accountData){
    resp.status_code = 401.3;
    resp.done = false;
    return resp;
  }

  /* ------------------- Get Account data by account_address ------------------- */
  var dbAccount = await queries.select_table('accounts', {account_address: accountData.account_address});
  if(!dbAccount.done){
    resp.status_code = 500.1;
    resp.done = false;
    return resp;
  }
  if(!dbAccount.data){
    resp.status_code = 401.3;
    resp.done = false;
    return resp;
  }
  if(dbAccount.data[0].is_suspended){
    resp.status_code = 401.1;
    resp.done = false;
    return resp;
  }

  resp.status_code = 200;
  resp.done = true;
  resp.result = dbAccount.data[0];
  return resp;
}

module.exports = {
  getAccountByAuthTokent
};
