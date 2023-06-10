import api from "@/services/api";

const actions = {
  async fetchAccount({ commit }) {
    let apiResponse = await api.get_account();
    if(apiResponse.data.done) {
			commit('setConnectionStoreByKey', {
				account_status: apiResponse.data.result[0].account_status,
				main_account_address: apiResponse.data.result[0].main_account_address
			});
      return apiResponse.data.result[0];
    } else {
      commit('setProfileStore', null);
			commit('setConnectionStore', {is_connected: false});
      return null;
    }
  },

  async fetchProfile({ commit }) {
    let apiResponse = await api.get_account_profile();
    if(apiResponse.data.done) {
      commit('setProfileStore', apiResponse.data.result[0]);
      return apiResponse.data.result[0];
    } else {
      commit('setProfileStore', null);
			commit('setConnectionStore', {is_connected: false});
      return null;
    }
  },
  
  // async fetchProfile({ commit }, params) {
  //   let apiResponse = await api.get_profile(params);
  //   if(apiResponse.data.done) {
  //     commit('setProfileStore', apiResponse.data.result[0]);
  //   } else {
  //     commit('setProfileStore', null);
  //   }
  // },

  async logoutAccount({ commit }) {
    commit('setProfileStore', null);
    commit('setConnectionStore', {is_connected: false});
  },

}

export default actions;
