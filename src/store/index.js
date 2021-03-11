import { createStore } from 'vuex';
import router from '../router';

import ldposClient from 'ldpos-client';

const config = {
  hostname: '34.227.22.98',
  port: '7001',
  networkSymbol: 'clsk',
  chainModuleName: 'capitalisk_chain',
};

export default createStore({
  state() {
    return {
      client: null,
      connected: false,
      authenticated: false,
      login: {
        loading: false,
        error: null,
      },
    };
  },
  mutations: {
    async connect(state) {
      state.client = ldposClient.createClient(config);
      await state.client.connect();
      state.connected = true;
    },
    async authenticate(state, passphrase) {
      state.login.loading = true;
      try {
        state.authenticated = false;

        await state.client.connect({ passphrase });
        state.authenticated = true;

        setTimeout(async () => {
          console.log('logging out 15min passed...');
          await this.commit('deauthenticate');
        }, 15 * 1000 * 60);

        if (state.authenticated) router.push('/');
      } catch (e) {
        state.login.error = e.message;
        state.authenticated = false;
      }
      state.login.loading = false;
    },
    async deauthenticate(state) {
      try {
        await state.client.disconnect();
        await this.commit('connect');
      } catch (e) {
        console.error(e);
      }
      state.connected = false;
      state.authenticated = false;
    },
  },
  getters: {},
  setters: {},
});