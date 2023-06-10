const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class cryptography{

  /********************************   jwt sign data   ********************************/
  
  jwt_sign_data(data, expires_in='24h'){
    try{
      return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: expires_in});
    }catch(e){
      // console.log(e);
      return null;
    }
  }
  
  /********************************   jwt verify token   ********************************/
  
  jwt_verify_token(token){
    try{
      return jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
      // console.log(e);
      return null;
    }
  }
  
  /********************************   get pure token   ********************************/
  
  get_pure_token(token){
    var parts = token.split(' ');
    if(parts.length == 2){
      let scheme = parts[0];
      if(!(/^Bearer$/i.test(scheme))){
        return null;
      }
      token = parts[1];
    }
    return token;
  }
  
  /********************************   cipher encrypt   ********************************/

  cipher_encrypt(secret, security_key, init_vector){
    try{
      // 16 bytes of env data
      const initVector = Buffer.from(init_vector, 'hex');
      
      // the cipher function
      const cipher = crypto.createCipheriv('aes-256-cbc', security_key, initVector);

      // encrypt the secret
      let encryptedData = cipher.update(secret, 'utf-8', 'hex');

      encryptedData += cipher.final('hex');
      
      return encryptedData;
    }catch(e){
      console.log(e);
      return null;
    }
  }
  
  /********************************   cipher decrypt   ********************************/
  
  cipher_decrypt(encrypted_data, security_key, init_vector){
    try{
      const initVector = Buffer.from(init_vector, 'hex');
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', security_key, initVector);

      let decryptedData = decipher.update(encrypted_data, "hex", "utf-8");

      decryptedData += decipher.final("utf8");

      return decryptedData;
    }catch(e){
      console.log(e);
      return null;
    }
  }

  // hex_encode(str){
  //   // var hex, i;
  //   // var result = '';
  //   // for (i = 0; i < str.length; i++){
  //   //     hex = str.charCodeAt(i).toString(16);
  //   //     result += ("000"+hex).slice(-4);
  //   // }
  //   // return result;

  //   var hash = 0, i, chr;
  //   if (str.length === 0) return hash;
  //   for (i = 0; i < str.length; i++) {
  //     chr   = str.charCodeAt(i);
  //     hash  = ((hash << 5) - hash) + chr;
  //     hash |= 0; // Convert to 32bit integer
  //   }
  //   return hash;
  // }

  // hex_decode(hex){
  //   var j;
  //   var hexes = hex.match(/.{1,4}/g) || [];
  //   var result = '';
  //   for(j = 0; j < hexes.length; j++){
  //     result += String.fromCharCode(parseInt(hexes[j], 16));
  //   }
  //   return result;
  // }

  random_uuid(){
    return crypto.randomUUID();
  }

  password_scrypt(password, salt, keylen = 64){
    return crypto.scryptSync(password, salt, keylen).toString('hex');
  }

  hash_md5(token){
    return crypto.createHash('md5').update(token).digest('hex');
  }
  
  hash_sha256(token){
    return crypto.createHash('sha256').update(token).digest('hex');
  }
  
  hash_sha512(token){
    return crypto.createHash('sha512').update(token).digest('hex');
  }
  
  random_token(token_len){
    const up_to = Math.pow(10, token_len);
    return crypto.randomInt(0, up_to).toString().padStart(token_len, "0");
  }
  
  random_number(number_len){
    const up_to = Math.pow(10, number_len);
    return crypto.randomInt(0, up_to);
  }

  randomChar() {
    var index = Math.floor(Math.random() * 62);
    // Generate Number character
    if (index < 10) {
      return String(index);
      // Generate capital letters
    } else if (index < 36) {
      return String.fromCharCode(index + 55);
    } else {
      // Generate small-case letters
      return String.fromCharCode(index + 61);
    }
  }
  
  random_string(str_len){
    var result = "";
    while(str_len > 0) {
      result += this.randomChar();
      str_len--;
    }
    return result;
  }
}

module.exports = new cryptography();
