const yaml = require('js-yaml')
const fs = require('fs');
class parameters{
  #conf;
  #config_file;
  constructor(){
    this.#config_file  = './configs/regex.yaml';
    try {
      //Loading Validation YAML Config File
      let fileContents = fs.readFileSync(this.#config_file, 'utf8');
      this.#conf = yaml.load(fileContents);
    }catch(e){
      this.#conf = false;
    }
  }

  validate_request_params(http_request, required_params=[], optional_params=[]){
    var values = http_request.body;
    var queries = http_request.query;
    if(!(Object.keys(queries).length === 0)){
      for(let _key in queries){
        values[_key] = queries[_key];
      }
    }
    var result = {
      hasSameSize: false,
      hasErrors: false,
      hasWarnings:false,
      verifiedParams:{},
      clientSpecs:{},
      errors:{},
      warnings:{}
    }
    if(!(this.#conf)){
      result.errors['ConfigFile'] = 'Parameters Config File Not Loaded.';
      result.hasErrors = true;
      return result;
    }
    if(!(typeof values === 'object')) {
      result.errors['InputType'] ='Parameters must be a JSON Object';
      result.hasErrors = true;
      return result;
    }
    if (Object.keys(values).length < required_params.length){
      result.warnings['InputCount'] ='Count of given and required parameters not equal.';
      result.hasSameSize = false;
      result.hasWarnings = true;
    }else{
      result.hasSameSize = true;
    }
    
    // Check Required Params Existence
    required_params.forEach(required_param => {
      if(!(required_param in values)){
        result.errors[`${required_param}`] = 'Missing required parameter.';
        result.hasErrors = true;
        return result;
      }
    });
    
    // Check Optional Params And Remove Empty Values
    optional_params.forEach(optional_param => {
      if(optional_param in values){
        if(!values[optional_param] || !values[optional_param].length){
          result.verifiedParams[optional_param] = null;
          delete values[optional_param];
        }
      }
    });

    let params = required_params.concat(optional_params);
    for (var param in values){
      if(params.includes(param)){
        values[param] = this.refine_param(param, values[param]);
        if(param in this.#conf.parameters){
          if('regex' in this.#conf.parameters[param]){
            let re = new RegExp(this.#conf.parameters[param].regex);
            if(re.test(values[param])){
              if(!(typeof values[param] === this.#conf.parameters[param].type)){
                result.errors[`${param}`] = 'Parameter type is invalid.';
                result.hasErrors = true;
              }else{
                result.verifiedParams[param] = values[param];
              }
            }else{
              result.errors[`${param}`] = 'Parameter format is incorrect.';
              result.hasErrors = true;
            }
          }
          if('type' in this.#conf.parameters[param]){
            if(this.#conf.parameters[param].type === 'boolean'){
              if(typeof values[param] == 'boolean'){
                result.verifiedParams[param] = values[param];
              }else if(values[param] == 1 || values[param] == '1' || values[param].toLowerCase() == 'true'){
                result.verifiedParams[param] = true;
              }else{
                result.verifiedParams[param] = false;
              }
            }else if(!(typeof values[param] === this.#conf.parameters[param].type)){
              result.errors[`${param}`] = 'Parameter type is invalid.';
              result.hasErrors = true;
            }else{
              result.verifiedParams[param] = values[param];
            }
          }
        }else{
          result.verifiedParams[param] = values[param];
          result.warnings[`${param}`]= 'Parameter not defined in regex.yaml.';
          result.hasWarnings = true;
        }
      }
    }
    var client_ip = http_request.headers['x-forwarded-for'] || http_request.socket.remoteAddress;
    if(client_ip.substr(0, 7) === '::ffff:'){
      client_ip = client_ip.substr(7);
    }else if(client_ip === '::1'){
      client_ip = '127.0.0.1';
    }
    result.clientSpecs = {
      ip_address: client_ip,
      user_agent: http_request.headers['user-agent'],
      host: http_request.headers.host,
      // content_type: http_request.headers['content-type']
    }
    return result;
  }

  // Refine Special Params
  refine_param(key, value){
    switch(key){
      case 'account_address':
        value = value.trim().toLowerCase();
        break;

      case 'main_account_address':
        value = value.trim().toLowerCase();
        break;
        
      case 'email':
        value = value.trim().toLowerCase();
        if(value.indexOf(' ') >= 0){
          value = '***';
        }
        break;
        
      case 'account_email':
        value = value.trim().toLowerCase();
        if(value.indexOf(' ') >= 0){
          value = '***';
        }
        break;
        
      case 'mobile':
        value = value.trim();
        if(value.startsWith('00')){
          value = '+' + value.substr(2);
        }else if(value.startsWith('09')){
          value = '+98' + value.substr(1);
        }else if(!value.startsWith('+')){
          value = '+' + value;
        }
        break;
        
      default:
        // value = value.trim();
        break;
        
      }
      return value;
  }
}

module.exports = new parameters();
