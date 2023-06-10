const libs = require.main.require('./libs');
const models = require.main.require('./models');

// Constructor of Endpoint Leaf
class leaf { // Required
  constructor(){
    this.__uri__ = '/profile'; // Required: Defining new leaf under /v1/
    this.__path__ = 'v1/endpoint/profile'; // Optional: path of file
    this.__add__ = true; // You Can tell express js to add or not this leaf to webservice
    this.__methods__ = { // Methods and Resposible Functions
      'get': getProfile // Setting for each http method a function
    };
  }
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************** GET: PROFILE ******************************/
async function getProfile(http_request, response){
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
  Source: body
  Names:
    profile_index
  */

  /******************* HTTP Request ********************************/
  /************* Validate Params Regex from libs.validations.validate_request_params() *************/
  try{
    var params = libs.validations.validate_request_params(http_request, ['profile_index'], []);
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
  
  /************* Find Account Username *************/
  let dbAccount = await models.queries.select_table('accounts', {account_username: params.verifiedParams.profile_index});
  if(!dbAccount.done){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  if(!dbAccount.data || !dbAccount.data.length){
    dbAccount = await models.queries.select_table('accounts', {account_address: params.verifiedParams.profile_index});
    if(!dbAccount.done){
      resp = libs.response.setup(resp, '500.1-1');
      response.status(200);
      response.json(resp);
      return
    }
    if(!dbAccount.data || !dbAccount.data.length){
      resp = libs.response.setup(resp, '404.1-1');
      resp.result = [];
      response.status(200);
      response.json(resp);
      return
    }
  }

  const Account = dbAccount.data[0];
  
  var profileParams = {
    account_address: Account.account_address,
    account_username: Account.account_username,
    account_email: Account.account_email,
    account_bio: Account.account_bio,
    account_social: Account.account_social,
    account_image_url: Account.account_image_url,
    account_cover_url: Account.account_cover_url,
    account_created_nfts: null,
    account_owned_nfts: null,
    account_favorited_nfts: null,
  }

  /************* All Collections *************/
  let dbCollections = await models.queries.select_table('collections');
  var accountCollections = {};
  if(dbCollections.done && dbCollections.data && dbCollections.data.length) {
    dbCollections.data.forEach(collection => {
      accountCollections[collection.collection_id] = {
        collection_id: collection.collection_id,
        category_id: collection.category_id,
        collection_creator: collection.collection_creator,
        collection_creator_share: collection.collection_creator_share,
        collection_creator_earnings: collection.collection_creator_earnings,
        collection_name: collection.collection_name,
        collection_verified: collection.collection_verified,
        collection_direct_link: collection.collection_direct_link,
        collection_description: collection.collection_description,
        collection_logo_url: collection.collection_logo_url,
        collection_banner_url: collection.collection_banner_url,
        collection_featured_url: collection.collection_featured_url,
        collection_link_yoursite: collection.collection_link_yoursite,
        collection_link_discord: collection.collection_link_discord,
        collection_link_twitter: collection.collection_link_twitter,
        collection_link_instagram: collection.collection_link_instagram,
        collection_link_medium: collection.collection_link_medium,
        collection_link_telegram: collection.collection_link_telegram,
        collection_nsfw: collection.collection_nsfw,
        collection_deployed: collection.collection_deployed,
        collection_imported: collection.collection_imported,
        collection_launched: collection.collection_launched,
        collection_total_nfts: collection.collection_total_nfts,
        
        blockchain_network: collection.blockchain_network,
        payment_tokens: collection.payment_tokens,
        
        collection_contract_address: collection.collection_contract_address,
        collection_contract_owner: collection.collection_contract_owner,
        collection_contract_name: collection.collection_contract_name,
        collection_contract_symbol: collection.collection_contract_symbol,
        collection_mint_price: collection.collection_mint_price,
        collection_max_supply: collection.collection_max_supply,
        collection_max_mint: collection.collection_max_mint,
        collection_total_supply: collection.collection_total_supply,
        collection_balance: collection.collection_balance,
        // contract_abi: collection.contract_abi,
      }
    })
  }
  
  /************* Account NFTs in Launchpad *************/
  let dbLaunch = await models.queries.select_table('launchpad', {nft_creator: Account.account_address});
  var accountLaunch = {};
  if(dbLaunch.done && dbLaunch.data && dbLaunch.data.length) {
    dbLaunch.data.forEach(launch => {
      accountLaunch[launch.nft_id] = {
        launch_id: launch.launch_id,
        nft_id: launch.nft_id,
        nft_mint_price: launch.nft_mint_price,
        launched_at: launch.launched_at
      }
    })
  }
  
  /************* Account NFTs in Marketplace *************/
  let dbMarket = await models.queries.select_table('marketplace', {nft_owner: Account.account_address, market_status: 'listed'});
  var accountMarket = {};
  if(dbMarket.done && dbMarket.data && dbMarket.data.length) {
    dbMarket.data.forEach(market => {
      accountMarket[market.nft_id] = {
        market_id: market.market_id,
        nft_id: market.nft_id,
        nft_list_price: market.nft_list_price,
        listed_at: market.listed_at
      }
    })
  }
  
  /************* Fetch Account Created NFTs *************/
  let dbCreatedNfts = await models.queries.select_table('nfts', {nft_creator: Account.account_address, nft_minted: true});
  if(!dbCreatedNfts.done){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  if(dbCreatedNfts.data && dbCreatedNfts.data.length){
    profileParams.account_created_nfts = [];
    dbCreatedNfts.data.forEach(nft => {
      if(nft.nft_minted || (!nft.nft_minted && nft.nft_launched)) {
        let nftImage = nft.nft_image;
        let nftFiles = nft.nft_files;
        let nftAttributes = nft.nft_attributes;
        if(accountLaunch[nft.nft_id] && accountLaunch[nft.nft_id].launch_random) {
          nftImage = accountCollections[nft.collection_id].collection_logo_url;
          nftFiles = [];
          nftAttributes = [];
        }

        profileParams.account_created_nfts.push({
          nft_id: nft.nft_id,
          collection_id: nft.collection_id,
          collection: accountCollections[nft.collection_id],
          launch: accountLaunch[nft.nft_id] || null,
          market: accountMarket[nft.nft_id] || null,
          nft_creator: nft.nft_creator,
          nft_creator_earnings: nft.nft_creator_earnings,
          nft_owner: nft.nft_owner,
          nft_name: nft.nft_name,
          nft_verified: nft.nft_verified,
          nft_direct_link: nft.nft_direct_link,
          nft_external_url: nft.nft_external_url,
          nft_description: nft.nft_description,
          nft_image: nftImage,
          nft_files: nftFiles,
          nft_attributes: nftAttributes,
          // nft_properties: nft.nft_properties,
          // nft_levels: nft.nft_levels,
          // nft_stats: nft.nft_stats,
          nft_nsfw: nft.nft_nsfw,
          nft_minted: nft.nft_minted,
          nft_launched: nft.nft_launched,
          nft_listed: nft.nft_listed,
          nft_last_price: nft.nft_last_price,
          nft_token_id: nft.nft_token_id,
          nft_status: nft.nft_status
        })
      }
    })
  }

  /************* Fetch Account Owned NFTs *************/
  let dbOwnedNfts = await models.queries.select_table('nfts', {nft_owner: Account.account_address, nft_minted: true});
  if(!dbOwnedNfts.done){
    resp = libs.response.setup(resp, '500.1-1');
    response.status(200);
    response.json(resp);
    return
  }
  if(dbOwnedNfts.data && dbOwnedNfts.data.length){
    profileParams.account_owned_nfts = [];
    dbOwnedNfts.data.forEach(nft => {
      if(nft.nft_minted || (!nft.nft_minted && nft.nft_launched)) {
        let nftImage = nft.nft_image;
        let nftFiles = nft.nft_files;
        let nftAttributes = nft.nft_attributes;
        if(accountLaunch[nft.nft_id] && accountLaunch[nft.nft_id].launch_random) {
          nftImage = accountCollections[nft.collection_id].collection_logo_url;
          nftFiles = [];
          nftAttributes = [];
        }

        profileParams.account_owned_nfts.push({
          nft_id: nft.nft_id,
          collection_id: nft.collection_id,
          collection: accountCollections[nft.collection_id],
          launch: accountLaunch[nft.nft_id] || null,
          market: accountMarket[nft.nft_id] || null,
          nft_creator: nft.nft_creator,
          nft_creator_earnings: nft.nft_creator_earnings,
          nft_owner: nft.nft_owner,
          nft_name: nft.nft_name,
          nft_verified: nft.nft_verified,
          nft_direct_link: nft.nft_direct_link,
          nft_external_url: nft.nft_external_url,
          nft_description: nft.nft_description,
          nft_image: nftImage,
          nft_files: nftFiles,
          nft_attributes: nftAttributes,
          // nft_properties: nft.nft_properties,
          // nft_levels: nft.nft_levels,
          // nft_stats: nft.nft_stats,
          nft_nsfw: nft.nft_nsfw,
          nft_minted: nft.nft_minted,
          nft_launched: nft.nft_launched,
          nft_listed: nft.nft_listed,
          nft_last_price: nft.nft_last_price,
          nft_token_id: nft.nft_token_id,
          nft_status: nft.nft_status
        })
      }
    });
  }
// console.log(profileParams);
  // All is done.
  resp = libs.response.setup(resp, '200.1-1');
  resp.result = [profileParams];
  response.status(200);
  response.json(resp);
  return
}
   
module.exports = new leaf();
