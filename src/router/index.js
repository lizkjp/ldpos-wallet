import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store';

// TODO: add property to environment to force transactions to be the homepage

const routes = [
  {
    path: '/',
    name: process.env.IS_ELECTRON ? 'Wallet' : 'Transactions',
    component: () =>
      process.env.IS_ELECTRON
        ? import(/* webpackChunkName: "login" */ '../views/Login.vue')
        : import(
            /* webpackChunkName: "transactions" */ '../views/Transactions.vue'
          ),
  },
  {
    path: '/voting',
    name: 'Voting',
    component: () =>
      import(/* webpackChunkName: "voting" */ '../views/Voting.vue'),
  },
  {
    path: process.env.IS_ELECTRON ? '/transactions' : '/login',
    name: process.env.IS_ELECTRON ? 'Transactions' : 'Wallet',
    component: () =>
      process.env.IS_ELECTRON
        ? import(
            /* webpackChunkName: "transactions" */ '../views/Transactions.vue'
          )
        : import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/blocks',
    name: 'Blocks',
    component: () =>
      import(/* webpackChunkName: "blocks" */ '../views/Blocks.vue'),
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () =>
      import(/* webpackChunkName: "accounts" */ '../views/Accounts.vue'),
  },
  {
    path: '/blockchains',
    name: 'Blockchains',
    component: () =>
      import(/* webpackChunkName: "blockchains" */ '../views/Blockchains.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(() => {
  store.toggleNav(false);
  store.initiateOrRenewTimeout();
});

export default router;
