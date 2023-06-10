const _responses = require.main.require('./configs/responses.json');
class response{

  setup(response, response_id) {
    const _id = response_id.split('-')
    const _code = _id[0].split('.');
    response.response_id = response_id;
    response.status_code = _code[0];
    if(typeof _responses[_code[0]] == 'undefined' || typeof _responses[_code[0]].messages[parseInt(_code[1]) - 1] == 'undefined'){
      response.done = false;
      response.message_type = 'error';
      response.message = 'Undefined Response Id';
    }else{
      response.done = _responses[_code[0]].done;
      response.message_type = _responses[_code[0]].message_type;
      response.message = _responses[_code[0]].messages[parseInt(_code[1]) - 1][global._LANG];
    }
    return response;
  }

}

module.exports = new response();
