import app from '@/main'
import router from '@/router'

import { ethers } from 'ethers'
import api from "@/services/api"
import store from "@/store"
import { notification } from '@/plugins'

import { evm } from '@/sdk'
const NETWORKS = evm.constants.NETWORKS

// DETECT METAMASK 
function detectMetamask() {
	const deviceType = app.config.globalProperties.device.type
	if(window.ethereum) {
		return true;
	} else {
		if(deviceType.mobile) {
			notification({
				title: "Mobile App",
				message:
					'First of all, you have to install the <a href="https://metamask.io/" target="_blank">MetaMask mobile app</a>.' +
					"<br> Then you can use MetaMask mobile app browser!",
				dangerouslyUseHTMLString: true,
				type: "warning",
				duration: 10000,
			});
		} else {
			notification({
				title: "MetaMask Not Found",
				message:
					'First of all, you have to visit the <a href="https://metamask.io/" target="_blank">MetaMask website</a>.' +
					"<br> Click on the “Download” option to install the MetaMask wallet.",
				dangerouslyUseHTMLString: true,
				type: "warning",
				duration: 10000,
			});
		}
		return false;
	}
}

// GET PROVIDER
async function getProvider() {
	if(window.ethereum) {
		let provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
		let reqNetwork = await provider.getNetwork()
		let chainId = reqNetwork.chainId
		// provider = provider.provider
		provider.provider['network'] = NETWORKS.find(n => (n.chainId === '0x' + chainId.toString(16))) || null
		return provider
	} else {
		return null
	}
}

// SET WATCHERS
function setWatchers(reload) {
	window.ethereum.on('accountsChanged', (metamaskAccounts) => {
		// console.log('window.ethereum.on > accountsChanged');
		let connection = store.getters.getConnectionStore;
		if(connection && connection.is_connected && metamaskAccounts.length > 0 && metamaskAccounts[0] != connection.account_address) {
			getAccount(metamaskAccounts);
		} else {
			disconnectWallet();
		}
		if(reload) {
			// router.push('/');
			router.go();
		}
	});

	window.ethereum.on('chainChanged', () => {
		// console.log('window.ethereum.on > chainChanged');
		let connection = store.getters.getConnectionStore;
		if(connection && connection.is_connected) {
			// window.location.reload();
			router.go();
		}
	});
}

// GET ACCOUNT
async function getAccount(metamaskAccounts) {
	const notification = app.config.globalProperties.notif;
	if(metamaskAccounts.length > 0) {
		// Send to Server via API
		let apiResponse = await api.post_account_connect({ account_address: metamaskAccounts[0] });
		if(apiResponse.data.done) {
			const connectedAccount = apiResponse.data.result[0];
			store.commit('setConnectionStore', {
				is_connected: true,
				account_address: connectedAccount.account_address,
				account_status: connectedAccount.account_status,
				main_account_address: connectedAccount.main_account_address,
				access_token: connectedAccount.access_token,
				last_connect: connectedAccount.last_connect,
				expiration_date: connectedAccount.expiration_date
			});
			if(connectedAccount.account_status == 'fresh' || connectedAccount.account_status == 'waiting') {
				router.push("/account");
				return true;
			} else {
				store.dispatch('fetchProfile');
				notification({
					title: "SUCCESS!",
					message:
						"You have successfully connected with MetaMask wallet." +
						`<br>Account: ${app.config.globalProperties.utils.truncate(connectedAccount.account_address, 12)}`,
					dangerouslyUseHTMLString: true,
					type: "success",
					duration: 3000,
					onClose: () => { /* router.push("/account/profile") */ }
				});
				return true;
			}
		} else {
			store.commit('setConnectionStore', {is_connected: false});
			store.commit('setProfileStore', null);
			router.push("/");
			notification({
				title: "Server apiResponse!",
				message: apiResponse.data.message,
				type: apiResponse.data.message_type,
				duration: 5000,
			});
			return false;
		}
	} else {
		store.commit('setConnectionStore', {is_connected: false});
		store.commit('setProfileStore', null);
		notification({
			title: "No MetaMask Account Detected!",
			message:
				"No accounts were found connected to your MetaMask wallet.",
			dangerouslyUseHTMLString: true,
			type: "error",
			duration: 3000,
		});
		return true;
	}
}

async function connectMetamaskWallet() {
	try {
		const deviceType = app.config.globalProperties.device.type
		let isConnected = store.getters.getConnectionStoreByKey('is_connected');
		if(!deviceType.mobile && !isConnected) {
			await window.ethereum.request({
				method: "wallet_requestPermissions",
				params: [
					{
						eth_accounts: {},
					},
				],
			});
		}

		const metamaskAccounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});

		let result = await getAccount(metamaskAccounts);
		return result;
	} catch (err) {
		console.log(err);
		notification({
			title: "OOPS!",
			message: "Something Went Wrong, Please Try Again.",
			type: "error",
			duration: 3000,
		});
		return false;
	}
}

// GET ACTIVE NETWORK
async function getActiveNetwork() {
	try {
		let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		return parseInt(provider.provider.network.chainId, 16);
	} catch(err) {
		console.log(err);
		return null;
	}
}

// SWITCH NETWORK
async function switchNetwork(chainId) {
	let provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
	let network = NETWORKS.find((n) => n.chainId === "0x" + chainId.toString(16));
	network = network || NETWORKS[4];
	await provider.send("wallet_addEthereumChain", [
		{
			chainId: network.chainId,
			chainName: network.chainName,
			nativeCurrency: network.nativeCurrency,
			rpcUrls: network.rpcUrls,
		},
	]);
	await provider.send("eth_requestAccounts", []);
	router.push('/');
}

// PERSONAL SIGN
async function personalSign(challenge, address, deniedMessage) {
	let personalSign = null;
	try {
		let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		personalSign = await provider.send("personal_sign", [challenge, address]);
	} catch (err) {
		// console.log(err);
		if(err.code === 4001 && deniedMessage) {
			notification({
				// title: "OOPS!",
				message: deniedMessage,
				type: "error",
				duration: 3000,
			});
		} else if(err.code != 4001) {
			notification({
				title: "OOPS!",
				message: "Something Went Wrong, Please Try Again.",
				type: "error",
				duration: 3000,
			});
		}
	}
	return personalSign;
}

// DISCONNECT WALLET
async function disconnectWallet() {
	store.commit('setConnectionStore', {is_connected: false});
	store.commit('setProfileStore', null);
	// router.push('/');
	router.go();
}

export default {
	detectMetamask,
	getProvider,
	setWatchers,
	getAccount,
	connectMetamaskWallet,
	getActiveNetwork,
	switchNetwork,
	personalSign,
	disconnectWallet 
};
