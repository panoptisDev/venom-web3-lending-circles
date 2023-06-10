const getters = {
	getVisitVenomHackStore(state) {
		return state.visitVenomHack || false;
	},
	getAcceptCookiesStore(state) {
		return state.acceptCookies || false;
	},
	getDarkModeStore(state) {
		return state.darkMode;
	},
	getConnectionStore(state) {
		return state.connection;
	},
	getConnectionStoreByKey: (state) => (key) => {
		return (state.connection && key in state.connection) ? state.connection[key] : undefined;
	},
	getProfileStore(state) {
		return state.profile;
	},
	getProfileStoreByKey: (state) => (key) => {
		return (state.profile && key in state.profile) ? state.profile[key] : undefined;
	}
}

export default getters;
