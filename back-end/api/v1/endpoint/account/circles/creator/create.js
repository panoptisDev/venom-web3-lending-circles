const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/circles/creator/create'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/circles/creator/create'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': createCircle // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function createCircle(http_request, response){
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
    var params = libs.validations.validate_request_params(http_request, [
      'circle_id',
      'circle_contract',
      'circle_chain_id',
      'circle_payment_token',
      'circle_round_days',
      'circle_payment_type',
      'circle_creator_earnings'
    ], []);
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

  /***************** Insert Circles *******************/
  // // generate circle_id
  // let circle_id = {
  //   account_address: Account.account_address,
  //   main_account_address: Account.main_account_address,
  //   created_at: new Date().getTime(),
  //   random_token: libs.cryptography.random_token(10)
  // };
  // const circleId = libs.cryptography.hash_md5(JSON.stringify(circle_id));

  // const tomoChain = { "chainId": "88", "chainName": "TomoChain" };
  // const paymentTokens = [
  //   {
  //     "name": "Tomo",
  //     "symbol": "TOMO",
  //     "decimals": 18,
  //     "logo": "https://cryptologos.cc/logos/tomochain-tomo-logo.png?v=002"
  //   },
  //   {
  //     "name": "Tether",
  //     "symbol": "USDT",
  //     "decimals": 6,
  //     "logo": "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024"
  //   }
  // ];

  let circle_params = {
    circle_id: params.verifiedParams.circle_id,
    circle_contract: params.verifiedParams.circle_contract,
    circle_chain_id: params.verifiedParams.circle_chain_id,
    circle_payment_token: params.verifiedParams.circle_payment_token,
    circle_creator: Account.account_address,
    circle_creator_main: Account.main_account_address,
    circle_creator_earnings: params.verifiedParams.circle_creator_earnings,
    circle_round_days: params.verifiedParams.circle_round_days,
    circle_payment_type: params.verifiedParams.circle_payment_type,
    circle_service_charge: process.env.PILTONET_CIRCLES_SERVICE_CHARGE / 10000,
    circle_service_address: process.env.VENOM_SERVICE_ADMIN_ADDRESS,
    circle_status: 'deployed',
    circle_deployed_at: new Date()
  }
  let circles_insert = await models.queries.insert_table('circles', circle_params);
  if(!circles_insert.done){
    resp = libs.response.setup(resp, `${circles_insert.code}-3`);
    response.status(200);
    response.json(resp);
    return
  }

  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'Circle has been created successfully.';
  resp.result = [circle_params];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
