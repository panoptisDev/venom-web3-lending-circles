const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/account/circles/creator/members'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/account/circles/creator/members'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getAccountCircleMembers // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: CIRCLE MEMBERS ******************************/
async function getAccountCircleMembers(http_request, response){
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
  /*
  Method: GET
  Header: Authorization
  */

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

  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, ['circle_id'], []);
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

  /***************** Get Circle *******************/
  let circles_where_params = {
    circle_id: params.verifiedParams.circle_id,
    circle_creator_main: Account.main_account_address
  }
  let dbCircles = await models.queries.select_table('circles', circles_where_params);
  if(!dbCircles.done || !dbCircles.data){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  var Circle = dbCircles.data[0];

  /***************** Get Circle Members *******************/
  let dbMembers = await models.queries.select_table('circles_members',
    {
      circle_id: params.verifiedParams.circle_id,
      member_status: 'joined'
    }, null, ['member_selected_round', 'desc'], ['created_at', 'desc']);
  if(!dbMembers.done){
    resp = libs.response.setup(resp, `${dbMembers.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Members = dbMembers.data || [];
  var memberList = Array.from({length: Circle.circle_max_members}, () => ({}));
  var memberMainAccounts = [];
  
  let i = 0;
  
  for(let member of Members) {
    if(member.main_account_address in MainAccountsMakeup) {
      const memberAccount = {...MainAccountsMakeup[member.main_account_address]}
      memberAccount['member_id'] = member.member_account_address;
      memberAccount['main_account_address'] = member.main_account_address;
      memberAccount['member_account_address'] = member.member_account_address;
      memberAccount['member_is_moderator'] = member.member_is_moderator;
      memberAccount['member_selected_round'] = member.member_selected_round;
      memberAccount['member_status'] = member.member_status;
      memberAccount['created_at'] = member.created_at;
      if(Circle.circle_winners_order == 'fixed') {
        memberList[member.member_selected_round] = memberAccount;
      } else {
        memberList[i++] = memberAccount;
      }
      
      memberMainAccounts.push(member.main_account_address);
    }
  }

  /***************** Get Circle Whitelists *******************/
  let dbWhitelists = await models.queries.select_table('circles_whitelists', {circle_id: params.verifiedParams.circle_id}, null, ['updated_at', 'desc']);
  if(!dbWhitelists.done){
    resp = libs.response.setup(resp, `${dbWhitelists.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Whitelists = dbWhitelists.data || [];
  var inviteList = null;
  var inviteMainAccounts = [];
  for(let invite of Whitelists) {
    if(invite.whitelist_account_address in MainAccountsMakeup) {
      const inviteAccount = {...MainAccountsMakeup[invite.whitelist_account_address]}
      inviteAccount['whitelist_is_alive'] = invite.whitelist_is_alive;
      inviteAccount['whitelist_is_joined'] = invite.whitelist_is_joined;
      inviteAccount['whitelist_is_rejected'] = invite.whitelist_is_rejected;
      inviteAccount['created_at'] = invite.created_at;
      inviteAccount['updated_at'] = invite.updated_at;
      if(!inviteList) inviteList = [];
      inviteList.push(inviteAccount);
      inviteMainAccounts.push(invite.whitelist_account_address);
    }
  }

  /***************** Get Contacts *******************/
  let contacts_where_params = {
    main_account_address: Account.main_account_address,
    contact_status: 'connected'
  }
  let dbContacts = await models.queries.select_table('contacts', contacts_where_params);
  if(!dbContacts.done){
    resp = libs.response.setup(resp, `${dbContacts.code}-2`);
    response.status(200);
    response.json(resp);
    return
  }
  const Contacts = dbContacts.data || [];
  var contactList = null;
  for(let contact of Contacts) {
    if(!inviteMainAccounts.includes(contact.contact_account_address) && !memberMainAccounts.includes(contact.contact_account_address))
    if(contact.contact_account_address in MainAccountsMakeup) {
      const contactAccount = {...MainAccountsMakeup[contact.contact_account_address]}
      contactAccount['contact_id'] = contact.contact_id;
      contactAccount['contact_invited'] = inviteMainAccounts.includes(contact.contact_account_address);
      contactAccount['contact_joined'] = memberMainAccounts.includes(contact.contact_account_address);
      contactAccount['created_at'] = contact.created_at;
      contactAccount['updated_at'] = contact.created_at;
      if(!contactList) contactList = [];
      contactList.push(contactAccount);
    }
  }
  if(contactList) {
    contactList.sort(function(a, b) {
      if (a.account_fullname < b.account_fullname) return -1;
      if (a.account_fullname > b.account_fullname) return 1;
      return 0;
    });
  }
     
  let result = {
    ...Circle,
    contacts: contactList,
    members: memberList,
    invites: inviteList
  };

  console.log(result);
  // All is done.
  resp = libs.response.setup(resp, '200.1-1');
  resp.result = [result];
  response.status(200);
  response.json(resp);
  return
}
   
module.exports = new leaf();
