const libs = require.main.require('./libs');
const models = require.main.require('./models');
// const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/waiting_list'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/waiting_list'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'post': waiting_list // Setting for each http method a function
    };
  }
}

async function waiting_list(http_request, response){
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
  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, ['email'], []);
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

  /************* Add New Email To waiting_list_emails *************/
  var newEmail = await models.queries.insert_table('waiting_list_emails', {email: params.verifiedParams.email});
  if(!newEmail.done){
    resp = libs.response.setup(resp, `${newEmail.code}-1`);
    response.status(200);
    response.json(resp);
    return
  }

  /************************* Send Response *******************************/
  resp = libs.response.setup(resp, '200.1-1');
  resp.result = [{
    email: params.verifiedParams.email
  }];
  response.status(200);
  response.json(resp);
  return
}

module.exports = new leaf();
