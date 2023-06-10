const fs = require('fs');
const base64Img = require('base64-img');
const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/profile/update'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/profile/update'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': updateProfile // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
async function updateProfile(http_request, response){
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
  
  /************* Get Main Account *************/
  let dbMainAccount = await models.queries.select_table('main_accounts', {main_account_address: Account.main_account_address});
  if(!dbMainAccount.done || !dbMainAccount.data){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  const MainAccount = dbMainAccount.data[0];
  
  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, [],
      [
        'account_fullname',
        'account_image_url',
        'account_image_file',
        'account_social_twitter',
        'account_social_facebook',
        'account_social_instagram',
        'account_social_linkedin',
        'account_social_telegram'
      ]);
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

  /***************** Upload and Save Account Image *******************/
  const imageId = libs.cryptography.hash_md5(Account.main_account_address);

  if (params.verifiedParams.account_image_file) {
    var filepatch = base64Img.imgSync(params.verifiedParams.account_image_file, 'assets/images/account_image', `${imageId}`);
    const pathArr = filepatch.split('/');
    const fileName = pathArr[3];
    params.verifiedParams.account_image_url = `${process.env.APP_API_URL}v1/assets/images/account_image/${fileName}?ts=${Date.now()}`;
  }
  
  /***************** Update Main Account *******************/
  let main_account_params = {
    account_username: MainAccount.account_username,
    account_email: MainAccount.account_email,
    account_image_url: params.verifiedParams.account_image_url,
    account_fullname: params.verifiedParams.account_fullname,
    account_social_twitter: params.verifiedParams.account_social_twitter,
    account_social_facebook: params.verifiedParams.account_social_facebook,
    account_social_instagram: params.verifiedParams.account_social_instagram,
    account_social_linkedin: params.verifiedParams.account_social_linkedin,
    account_social_telegram: params.verifiedParams.account_social_telegram
  }
  let main_account_update = await models.queries.update_table('main_accounts', main_account_params, {id: MainAccount.id});
  if(!main_account_update.done){
    resp = libs.response.setup(resp, `${main_account_update.code}-3`);
    response.status(200);
    response.json(resp);
    return
  }

  resp.status_code = 200;
  resp.done = true;
  resp.message_type = 'success';
  resp.message = 'Account profile has been updated successfully.';
  resp.result = [main_account_params];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
