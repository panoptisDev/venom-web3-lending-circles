class regex {
  constructor() {
    this.regexes = {
      email: new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/),
      account_email: new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/),
      password: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
      mobile: new RegExp(/^((\+\d{1,3})|[0]{0,1}|)\d{10}$/),
      invite_code: new RegExp(/^[0-9a-zA-Z]{0,10}$/),
      account_username: new RegExp(/^[a-z0-9A-Z_]{3,20}$/),
      // account_username: new RegExp(/^(?=.{3,20}$)(?![_])(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_])$/),
      account_address: new RegExp(/^[0-9a-zA-Z]{42}$/),
      contract_address: new RegExp(/^[a-z0-9A-Z]{32,100}$/),
      captcha: new RegExp(/^.{1,}$/)
    },
    this.errorMessages = {
      email: "Please enter a valid email address.",
      account_email: "Please enter a valid email address.",
      password: "The password must be at least 6 characters long containing at least 1 number and 1 letter.",
      mobile: "Please enter a valid phone number.",
      invite_code: "Your invitation code is not valid.",
      account_username: "Please enter a valid username.",
      account_address: "Please enter a valid account.",
      contract_address: "Please enter a valid contract address.",
      captcha: "reCAPTCHA is required.",
      eula: "You must accept the End User License Agreement."
    }
  }
  validateOne(fieldName, fieldData) {
    let response = {
      hasError: false,
      errorMessage: false,
    }
    if(fieldName in this.regexes) {
      if(!this.regexes[fieldName].test(fieldData)) {
        response.hasError = true;
        response.errorMessage = this.errorMessages[fieldName];
      }
    }
    return response;
  }
  validateMany(form, required = true) {
    let response = {
      hasError: false,
      errorMessage: false,
    }
    for (let key in form) {
      if((form[key] && form[key].length) || required) {
        if(key in this.regexes) {
          if(!this.regexes[key].test(form[key])) {
            response.hasError = true;
            if(key in this.errorMessages) {
              response.errorMessage = this.errorMessages[key];
            }
            else {
              response.errorMessage = "there is no message."
            }
            return response;
          }
        }
      }
    }
    return response;
  }
}

export default new regex();
