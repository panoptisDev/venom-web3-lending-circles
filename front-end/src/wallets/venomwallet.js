// import { Address, ProviderRpcClient, TvmException } from "everscale-inpage-provider";
import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient } from "everscale-standalone-client";
import { VenomConnect } from "venom-connect";
import tokenRootAbi from '@/contracts/TokenRoot.abi.json';
import tokenWalletAbi from '@/contracts/TokenWallet.abi.json';
import { Base64 } from 'js-base64';
import { ElLoading } from 'element-plus'
import app from '@/main'
import router from '@/router'
import store from "@/store"
import api from "@/services/api"
import { notification } from '@/plugins'

const { AccountsContract } = require('@/contracts');

let exampleContract = undefined;

let connectedAccount = undefined;
let venomConnect = undefined;
let venomProvider = undefined;
let venomStandalone = undefined;
let accountBalance = undefined;
let tokenBalance = undefined;
let isConnected = false;
let openLoadings = [];

// GET DARK MODE
const getDarkMode = () => {
	return store.getters.getDarkModeStore;
}

// STANDALONE FALLBACK 
const standaloneFallback = () => EverscaleStandaloneClient.create({
  connection: {
    id: app?.config.globalProperties.defaultchain.chainId || 1000,
    group: process.env.VUE_APP_DEFAULT_NETWORK,
    type: "jrpc",
    data: {
      endpoint: app?.config.globalProperties.defaultchain.rpcUrl || undefined,
    }
  }
});

// INIT VENOMCONNECT 
const initVenomConnect = async () => {
  return new VenomConnect({
    theme: getDarkMode() ? 'dark' : 'light',
    checkNetworkId: app?.config.globalProperties.defaultchain.chainId || 1000,
    providersOptions: {
      venomwallet: {
        links: {
          // extension: [
          //   {
          //     browser: "chrome", // "chrome" | "firefox"
          //     link: "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch",
          //   },
          // ],
          // ios: "https://testflight.apple.com/join/x5jOlxzL",
          // android: "https://venomwallet.page.link/download",
          qr: "https://venomwallet.page.link/?link=https://piltonet.com/",
        },
        walletWaysToConnect: [
          {
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("venomwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true
            },
            id: "extension",
            type: "extension"
          }
        ],
        defaultWalletWaysToConnect: ["mobile", "ios", "android"]
      }
    }
  })
};

// INIT CONNECTION
const initConnection = async (forceConnect = false) => {
	let loadingId = showLoading();
	connectedAccount = await getStoredAccount();
	if(connectedAccount.is_connected || forceConnect) {
		venomConnect = await initVenomConnect();
	}
	openLoadings[loadingId].close();
	return venomConnect;
}

// CHECK AUTH
const checkAuth = async (_venomConnect) => {
	let loadingId = showLoading();
	venomConnect = _venomConnect;
	await _venomConnect.checkAuth();
	openLoadings[loadingId].close();
}

// CHECK CONNECTION
const checkConnection = async (_provider, loading = true) => {
	if(_provider) {
		let loadingId = null;
		if(loading) loadingId = showLoading();
		isConnected = true;
		venomProvider = _provider;
		connectedAccount = await getStoredAccount();
		const accountAddress = (await getAddress())?.address.toString() || undefined;
		if(accountAddress) {
			// accountBalance = await getBalance(_provider, accountAddress);
			getBalance(_provider, accountAddress, (balance) => {
				if(balance != undefined) accountBalance = balance;
				else disconnectWallet(_provider);
			});
			
			// tokenBalance = await getWalletBalance(_provider, accountAddress, '0:20470e6a6e33aa696263b5702608d69e3317c23bf20c2f921b38d6588c555603');
			if(app?.config.globalProperties.defaultchain.supportedTokens.length > 0) {
				getWalletBalance(_provider, accountAddress, app?.config.globalProperties.defaultchain.supportedTokens[0].address, (balance) => {
					if(balance != undefined) tokenBalance = balance;
				});
			}
			
			if(!connectedAccount.is_connected || connectedAccount.account_address != accountAddress || connectedAccount.expiration_date < new Date().getTime()) {
				await connectAccountToServer(_provider, accountAddress, accountBalance, tokenBalance);
			} else {
				store.commit('setConnectionStore', {
					is_connected: true,
					account_address: accountAddress,
					account_balance: accountBalance,
					token_balance: tokenBalance,
					account_status: connectedAccount.account_status,
					main_account_address: connectedAccount.main_account_address,
					access_token: connectedAccount.access_token,
					last_connect: connectedAccount.last_connect,
					expiration_date: connectedAccount.expiration_date
				});
			}
		}
		connectedAccount = await getStoredAccount();
		if(loading) openLoadings[loadingId].close();
		if(connectedAccount.is_connected && isConnected) {
			setTimeout(async () => {
				await checkConnection(_provider, false);
			}, 3000);
		} else {
			await disconnectWallet(_provider);
		}
	}
}

// GET PROVIDER
const getProvider = () => {
	return venomProvider;
}

// GET STORED ACCOUNT
const getStoredAccount = () => {
	return store.getters.getConnectionStore || {is_connected: false};
}

// GET ADDRESS 
async function getAddress(_address = undefined) {
	if(_address) {
		return new Address(_address)
	} else {
		if(venomProvider) {
			const providerState = await venomProvider?.getProviderState?.() || undefined;
			return providerState?.permissions.accountInteraction || undefined;
		} else {
			return undefined;
		}
	}
}

// GET PUBLICKEY 
async function getPublicKey() {
	if(venomProvider) {
		const providerState = await venomProvider?.getProviderState?.() || undefined;
		return providerState?.permissions.accountInteraction?.publicKey;
	} else {
		return undefined;
	}
}

// GET BALANCE 
async function getBalance(_provider, _address, callback) {
	let balance = undefined;
	try {
		balance = await _provider.getBalance?.(_address);
	} catch(err) {
		console.log(err);
	}

	if(typeof callback == 'undefined') {
		return balance;
	} else {
		callback(balance);
	}
}

const setupTokenWalletAddress = async (standalone, _address, tokenAddress) => {
	try {
		const contractAddress = new Address(tokenAddress); // Our TokenRoot address in venom testnet
		// We will use standalone-client form our venomConnect instance to call a view method of contract
		const contract = new standalone.Contract(tokenRootAbi, contractAddress); // creating a contract instance with contract address and interface (ABI)
		// Smart-contract calling. Function walletOf of TokenRoot will calculate user's tokenWallet address by it's VenomWallet address (wich was connected)
		const tokenWallet = (await contract.methods
			.walletOf({
				answerId: 0,
				walletOwner: _address,
			}).call());
		// if(!tokenWallet) return undefined;
		// tokenWalletAddress = tokenWallet.value0._address;
		return tokenWallet?.value0._address || undefined;
	} catch (err) {
		console.error(err);
	}
	return undefined;
}

const getStandalone = async (_venomConnect) => {
	return await _venomConnect?.getStandalone('venomwallet') || undefined;
}

const getWalletBalance = async (_provider, _address, tokenAddress, callback) => {
	let balance = undefined;
	if(venomConnect) {
		if(!venomStandalone) venomStandalone = await getStandalone(venomConnect);
		if(venomStandalone) {
			// if(!tokenWalletAddress) {
			const	tokenWalletAddress = await setupTokenWalletAddress(venomStandalone, _address, tokenAddress);
			// }
			if(tokenWalletAddress) {
				try {
					const contractAddress = new Address(tokenWalletAddress);
					const contract = new venomStandalone.Contract(tokenWalletAbi, contractAddress);
					// We check a contract state here to acknowledge if TokenWallet already deployed
					// As you remember, wallet can be deployed with first transfer on it.
					// If our wallet isn't deployed, so it's balance is 0 :)
					const contractState = await _provider.rawApi.getFullContractState({ address: tokenWalletAddress });
					if(contractState.state) {
						// But if this deployed, just call a balance function
						const result = (await contract.methods.balance({ answerId: 0 }).call());
						balance = result.value0; // It will be with decimals. Format if you want by dividing with 10**decimals
					} else {
						balance = 0;
					}
				} catch (err) {
					console.error(err);
				}
			}
		}
	}
	if(typeof callback == 'undefined') {
		return balance;
	} else {
		callback(balance);
	}
}

// PERSONAL SIGN
const personalSign = async (challenge, address, deniedMessage) => {
	if(venomProvider && connectedAccount?.is_connected && connectedAccount?.account_address == address) {
		try {
			const publicKey = await getPublicKey();
			const signDataObj = JSON.parse(JSON.stringify({
				publicKey: publicKey,
				data: Base64.encode(challenge),
			}));
			let signResult = await venomProvider.signData(signDataObj) || undefined;
			return signResult ? verifySign(publicKey, signResult.signature, signResult.dataHash) : undefined;
		} catch(err) {
			console.log(err);
			if(err.code === 3 && deniedMessage) {
				notification({
					// title: "OOPS!",
					message: deniedMessage || err.message,
					type: "error",
					duration: 3000,
				});
			} else {
				notification({
					title: "OOPS!",
					message: "Something Went Wrong, Please Try Again.",
					type: "error",
					duration: 3000,
				});
			}
		}
	}
	return undefined;
}

// VERIFY SIGN
const verifySign = async (publicKey, signature, dataHash) => {
	return (await venomProvider.verifySignature({
		publicKey: publicKey,
		signature: signature,
		dataHash: dataHash,
	}))?.isValid || false;
}

// DEPLOY CONTRACT
async function getExpectedAddress(contractJson, initParams) {
	let loadingId = showLoading();
	let contractAddress = undefined;
	try {
		contractAddress = await venomProvider.getExpectedAddress(
			contractJson.abi,
			{
			tvc: contractJson.tvc,
			initParams: initParams
			}
		);
	} catch(err) {
		console.log(err);
	}
	openLoadings[loadingId].close();
	return contractAddress;
}

async function deployContract(contractJson, initParams, constructorParams, initAmount) {
	let loadingId = showLoading();
	let newContract = undefined;
	try {
		const ABI = contractJson.abi;
		const base64Contract = contractJson.tvc;
	
		const providerState = await venomProvider.getProviderState();
		console.log('Proviver State fetch successfully:', providerState);

		const senderPublicKey = providerState?.permissions.accountInteraction?.publicKey;
		const senderAddress = providerState?.permissions.accountInteraction?.address;
		
		const deployParams = {
			tvc: base64Contract,
			workchain: 0,
			publicKey: senderPublicKey,
			initParams: initParams
		};
		// Get the expected contract address
		const contractAddress = await venomProvider.getExpectedAddress(ABI, deployParams);
		
		// Get the state init
		const stateInit = await venomProvider.getStateInit(ABI, deployParams);
		
		// Send the coins to the address
		await venomProvider.sendMessage({
			sender: senderAddress,
			recipient: contractAddress,
			amount: initAmount, // in nanotons
			bounce: false,
			stateInit: stateInit.stateInit,
		});
	
		// Create a contract instance
		newContract = new venomProvider.Contract(ABI, contractAddress);
		console.log('Create a contract instance:', newContract);
		// Call the contract constructor
		await newContract.methods
			.constructor(constructorParams)
			.sendExternal({
				stateInit: stateInit.stateInit,
				publicKey: deployParams.publicKey
			});
			console.log('Contract created successfully:', newContract);
	} catch(err) {
		console.log(err);
	}
	openLoadings[loadingId].close();
	return newContract;
}

async function getDeployedContract(contractJson, contractAddress) {
	let loadingId = showLoading();
	const ABI = contractJson.abi;
	const ADR = new Address(contractAddress);
	const Contract = new venomProvider.Contract(ABI, ADR);
	openLoadings[loadingId].close();
	return Contract;
}

async function sendInternalMessage(messageParams) {
	let loadingId = showLoading();
	const { transaction } = await venomProvider.sendMessage(messageParams);
	console.log('Transaction:', transaction);
	openLoadings[loadingId].close();
	return transaction;
}

async function sendExternallMessage(contractJson, contractAddress, method, messageParams) {
	let loadingId = showLoading();
	
	const providerState = await venomProvider.getProviderState();
	console.log('Proviver State fetch successfully:', providerState);

	const senderPublicKey = providerState?.permissions.accountInteraction?.publicKey;
	// const senderAddress = providerState?.permissions.accountInteraction?.address;
	
	const contract = await getDeployedContract(contractJson, contractAddress);
	console.log('Get contract successfully:', contract);

	messageParams = JSON.parse(JSON.stringify(messageParams))
	console.log('messageParams:', messageParams);
	const { transaction } = await contract.methods[method](messageParams).sendExternal(JSON.parse(JSON.stringify({
		publicKey: senderPublicKey
	})));
	console.log('Transaction:', transaction);
	openLoadings[loadingId].close();
	return transaction;
}

async function getPastEvents(contract, event = 'ComplexStateChanged', fromUtime = null) {
	let loadingId = showLoading();
	let pastEvents = undefined
	try {
		if(!fromUtime) fromUtime = (new Date().getTime() / 1000) - (10 * 24 * 60 * 60); // 10 day ago
		pastEvents = await contract.getPastEvents({
			filter: event,
			range: {
				fromUtime: fromUtime,
			},
		});
	} catch(err) {
		console.log(err);
	}
	openLoadings[loadingId].close();
	return pastEvents;
}

function getContractAddress() {
	return exampleContract?.address.toString() || undefined;
}

// CONNWCT ACCOUNT TO SERVER
async function connectAccountToServer(provider, accountAddress, accountBalance, tokenBalance) {
	// Send to Server via API
	let apiResponse = await api.post_account_connect({ account_address: accountAddress });
	if(apiResponse?.data.done) {
		const serverAccount = apiResponse.data.result[0];
		store.commit('setConnectionStore', {
			is_connected: true,
			account_address: accountAddress,
			account_balance: accountBalance,
			token_balance: tokenBalance,
			account_status: serverAccount.account_status,
			main_account_address: serverAccount.main_account_address,
			access_token: serverAccount.access_token,
			last_connect: serverAccount.last_connect,
			expiration_date: serverAccount.expiration_date
		});
		if(serverAccount.account_status == 'fresh' || serverAccount.account_status == 'waiting') {
			const accountsContractAddress = AccountsContract.address;
			const accountsContract = await getDeployedContract(AccountsContract, accountsContractAddress);
			const { account } = await accountsContract.methods.getAccount({
				accountAddress: new Address(accountAddress)
			}).call();
			if(account.created) {
				router.push("/account/create");
			} else {
				router.push("/account");
			}
			return true;
		}
		if(serverAccount.account_status == 'main' || serverAccount.account_status == 'linked') {
			store.dispatch('fetchProfile');
		}
		return await getStoredAccount();
	} else {
		return await disconnectWallet(provider);
	}
}

// DISCONNECT WALLET
async function disconnectWallet(provider) {
	accountBalance = undefined;
	tokenBalance = undefined;
	isConnected = false;
	await store.dispatch('logoutAccount');
	if(provider) {
		await provider.disconnect();
	}
}

// GET ACTIVE NETWORK
async function getActiveNetwork() {
	return venomProvider?._properties.checkNetworkId || app?.config.globalProperties.defaultchain.chainId || 1000;
}

const showLoading = () => {
	const randomId = Date.now();
	openLoadings[randomId] = undefined;
	openLoadings[randomId] = new ElLoading.service({
		lock: true,
		text: '',
		fullscreen: true,
	});
	return randomId;
}

export default {
	initVenomConnect,
	initConnection,
	checkAuth,
	checkConnection,
	getProvider,
	getStoredAccount,
	getAddress,
	getPublicKey,
	getBalance,
	getStandalone,
	getWalletBalance,
	personalSign,
	verifySign,
	getExpectedAddress,
	deployContract,
	getDeployedContract,
	sendInternalMessage,
	sendExternallMessage,
	getPastEvents,
	getContractAddress,
	connectAccountToServer,
	disconnectWallet,
	getActiveNetwork
}
