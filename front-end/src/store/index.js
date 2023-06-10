import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

const state = {
  /**
  **VenomHack visited by User**
  gettters: getVisitVenomHackStore
  mutations: setVisitVenomHackStore
  **/
  visitVenomHack: undefined,
  /**
  **Accept Cookies by User**
  gettters: getAcceptCookiesStore
  mutations: setAcceptCookiesStore
  **/
  acceptCookies: undefined,
  /**
  **Dark Mode**
  gettters: getDarkModeStore
  mutations: setDarkModeStore
  **/
  darkMode: window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true,
  /**
  **Account & Connection Data from Blockchain & BackEnd**
  gettters: getConnectionStore
  mutations: setConnectionStore
  **/
  connection: undefined,
  /**
  **Main Account Data from BackEnd**
  gettters: getProfileStoreByKey, getProfileStore
  mutations: setProfileStoreByKey, setProfileStore
  actions: fetchProfile
  **/
  profile: undefined,
}

export default createStore({
  plugins: [createPersistedState()],
  state,
  getters,
  actions,
  mutations
})
