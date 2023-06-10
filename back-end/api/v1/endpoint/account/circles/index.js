const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/circles'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/circles'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getAccountCircles // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: CIRCLES ******************************/
async function getAccountCircles(http_request, response){
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
    let response_id = `${connected_account.status_code}-0`;
    resp = libs.response.setup(resp, response_id);
    response.status(200);
    response.json(resp);
    return
  }
  const Account = connected_account.result;

  /***************** Get & Makeup Main Accounts *******************/
  let dbMainAccounts = await models.queries.select_table('main_accounts');
  if(!dbMainAccounts.done || !dbMainAccounts.data){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  var MainAccountsMakeup = {};
  for(let main_account of dbMainAccounts.data) {
    MainAccountsMakeup[main_account.main_account_address] = {
      main_account_address: main_account.main_account_address,
      account_username: main_account.account_username,
      account_email: main_account.account_email,
      account_fullname: main_account.account_fullname,
      account_social_twitter: main_account.account_social_twitter,
      account_social_instagram: main_account.account_social_instagram,
      account_social_linkedin: main_account.account_social_linkedin,
      account_social_telegram: main_account.account_social_telegram,
      account_image_url: main_account.account_image_url
    }
  }

  /***************** Get & Makeup Circles After Launch *******************/
  let dbCircles = await models.queries.select_table('circles', null, ['circle_status', '>=', 'launched']);
  if(!dbCircles.done){
    resp = libs.response.setup(resp, `${dbCircles.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  var CirclesMakeup = {};
  for(let circle of dbCircles.data || []) {
    circle['circle_creator'] = MainAccountsMakeup[circle.circle_creator_main] || null;
    CirclesMakeup[circle.circle_id] = circle;
  }

  var circlesResult = {
    whitelisted: null,
    joined: null,
    creating: null
  };

  /***************** Get Account in Circles Whitelists *******************/
  let dbWhitelists = await models.queries.select_table('circles_whitelists', {
    whitelist_account_address: Account.main_account_address,
    whitelist_is_alive: true,
    whitelist_is_joined: false,
    whitelist_is_rejected: false
  });
  if(!dbWhitelists.done){
    resp = libs.response.setup(resp, `${dbWhitelists.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Whitelists = dbWhitelists.data || [];
  for(let whitelist of Whitelists) {
    if(whitelist.circle_id in CirclesMakeup) {
      if(!circlesResult.whitelisted) circlesResult.whitelisted = [];
      circlesResult.whitelisted.push(CirclesMakeup[whitelist.circle_id]);
    }
  }

  /***************** Get Account in Circles Members *******************/
  let dbMembers = await models.queries.select_table('circles_members', {
    member_account_address: Account.main_account_address,
    member_status: 'joined'
  });
  if(!dbMembers.done){
    resp = libs.response.setup(resp, `${dbMembers.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Members = dbMembers.data || [];
  for(let member of Members) {
    if(member.circle_id in CirclesMakeup) {
      if(!circlesResult.joined) circlesResult.joined = [];
      circlesResult.joined.push(CirclesMakeup[member.circle_id]);
    }
  }

  /***************** Get Owned Circles (Creating) *******************/
  let dbCreatingCircles = await models.queries.select_table('circles',
    {circle_creator_main: Account.main_account_address}, ['circle_status', '<', 'completed']
  );
  if(!dbCreatingCircles.done){
    resp = libs.response.setup(resp, `${dbCreatingCircles.code}-1`);
    response.status(200);
    response.json(resp);
    return
  }
  const CreatingCircles = dbCreatingCircles.data || [];
  for(let circle of CreatingCircles) {
   
    let circleWhitelists = await models.queries.select_table('circles_whitelists', {circle_id: circle.circle_id});
    if(circleWhitelists.done && circleWhitelists.data){
      circle['circle_total_whitelisted'] = circleWhitelists.data.length;
    } else {
      circle['circle_total_whitelisted'] = 0;
    }

    if(!circlesResult.creating) circlesResult.creating = [];
    circlesResult.creating.push(circle);
  }
  

  // console.log(circlesResult);
  // All is done.
  resp = libs.response.setup(resp, '200.1-1');
  resp.result = [circlesResult];
  response.status(200);
  response.json(resp);
  return
}
   
module.exports = new leaf();
