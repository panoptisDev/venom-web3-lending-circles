import { createWebHistory, createRouter } from 'vue-router';
import app from '@/main'
import store from '@/store';
import routes from '@/router/routes';
import { nextTick } from 'vue';
import metamask from '@/wallets/metamask';
import venomwallet from '@/wallets/venomwallet';
import { notification } from '@/plugins'

const Blockchain = () => {return app?.config.globalProperties.defaultchain || null};
const Wallet = () => {return Blockchain()?.wallets[0] == 'venom-connect' ? venomwallet : metamask};

const router = createRouter({
	history: createWebHistory(),
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition && from.fullPath == '/account/settings') {
			return savedPosition
		} else {
			return { top: 0 }
		}
	},
	routes
});

router.beforeEach(async (to, from, next) => {
	// app.config.globalProperties.provider = await wallet.getProvider();
	// if(app.config.globalProperties.provider) {
	// 	if(('meta' in from && 'auth' in from.meta && from.meta.auth) || ('meta' in to && 'auth' in to.meta && to.meta.auth)) {
	// 		wallet.setWatchers(true);
	// 	} else {
	// 		wallet.setWatchers(false);
	// 	}
	// }
	if('meta' in to && 'auth' in to.meta && to.meta.auth) {
		let connectionStore = store.getters.getConnectionStore;
		if(connectionStore === undefined || !connectionStore.is_connected) {
			return next({ name: 'HomePage' });
		} 
		if(connectionStore.expiration_date < new Date().getTime()) {
			connectionStore = await Wallet()?.disconnectWallet();
			return next({ name: 'HomePage' });
		}
		if('chain' in to.meta && to.meta.chain) {
			const activeNetwork = await Wallet()?.getActiveNetwork();
			if(activeNetwork != Blockchain()?.chainId) {
				notification({
					title: 'Wrong Network!',
					message: `Please select ${Blockchain()?.name} in Wallet.`,
					dangerouslyUseHTMLString: true,
					type: 'error',
					duration: 3000
				})
				return next({ name: from.name || 'HomePage' });
			}
		}
		if('main' in to.meta && to.meta.main && ['fresh', 'waiting'].includes(connectionStore.account_status)) {
			return next({ name: 'AccountNew' });
		}
	}
	return next();
});

router.afterEach((to) => {
	nextTick(() => {
		document.title = to.meta.title || "Web3 Lending Circles";
	})
});

export default router;
