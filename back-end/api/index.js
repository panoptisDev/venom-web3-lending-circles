const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser')
const userAgent = require('express-useragent');
const { readdirSync } = require('fs');
const libs = require.main.require('./libs');

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

function config(){
  var app = {
    express: express(),
    language: 'en'
  }
  
  // Create app as Express JS Instance
  app.express.use(cors());
  
  // Add Cookie Parser to app
  app.express.use(cookieParser());
  
  // CORS Options and Trusted Domains
  var corsOptions = {
    origin: 'https://app.piltonet.com/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  // Add CORS with trusted domains to app
  // app.express.use(cors(corsOptions));
  
  // Using gzip compression to reduce response and request sizes
  app.express.use(compression());
  
  // Adding Body Parser to app;
  // parse application/x-www-form-urlencoded
  app.express.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  // parse application/json
  app.express.use(bodyParser.json({limit: '50mb', extended: true}))
  
  // Adding User Agent Parser to Express js
  app.express.use(userAgent.express());

  // Adding static folder
  app.express.use(express.static('public'))
  
  // Adding api versions directories
  let versions = getDirectories('./api/')
  for (var i = 0; i < versions.length; i++){
    add_routes(app.express, versions[i])
  }
  default_messages(app.express);

  return app;
}

function add_routes(app_express, version){
  app_express.use(`/${version}`, get_router(version));
}

function get_router(version){
  const router = express.Router();
  var endpoints = getDirectories(`./api/${version}/endpoint/`);
  for (var i =0 ; i < endpoints.length;i++){
    config_endpoint(router, version, endpoints[i]);
  }
  return router
}

function config_endpoint(router, version, endpoint){
  var files = readdirSync(`./api/${version}/endpoint/${endpoint}`);
  for(var i=0; i < files.length;i++){
    if(files[i].split('.').length <= 1){
      config_endpoint(router, version, endpoint+'/'+files[i])+'/';
    }else{
      if(!(/^[.]/.test(files[i]))){
        var _file = require(`./${version}/endpoint/${endpoint}/${files[i]}`);
        if (_file.__add__){
          for(method in _file.__methods__){
            try{
              router[method](_file.__uri__, _file.__methods__[method]);
            }catch(e){
              console.log(e)
            }
          }
        }
      }
    }
  }
  return router;
}

function default_messages(app_express){
  //Default error message when route is not defined (404 Not Found)
  let resp = {
    origin_url: null,
    response_id: null,
    status_code: 200,
    done: true,
    message_type: null,
    message: null,
    result: null
  };
  app_express.use(function (http_request, response, next) {
    resp.origin_url = http_request.protocol + '://' + http_request.get('host') + http_request.originalUrl;
    resp = libs.response.setup(resp, '404.1-1');
    response.status(404);
    response.json(resp);
    return
  })
}

module.exports = {
  config
}
