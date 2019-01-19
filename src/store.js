import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sideNav: {
      open: true,
    },
  },
  mutations: {
    TOGGLE_SIDE_NAV(state) {
      Vue.set(state.sideNav, 'open', !state.sideNav.open);
    },
  },
  actions: {
    toggleSideNav({ commit }) {
      commit('TOGGLE_SIDE_NAV');
    },
  },
});
