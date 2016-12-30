import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import { createListView } from '../views/CreateListView'
import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) { 
    if (savedPosition) console.log(savedPosition);
    if (savedPosition) return savedPosition;
    if (to.hash === '#infinite') return false;
    return {
      y: 0
    };
  },
  routes: [
    { path: '/top/:page(\\d+)?', component: createListView('top'), meta: { infinite: false } },
    { path: '/new/:page(\\d+)?', component: createListView('new'), meta: { infinite: false } },
    { path: '/show/:page(\\d+)?', component: createListView('show'), meta: { infinite: false } },
    { path: '/ask/:page(\\d+)?', component: createListView('ask') },
    { path: '/job/:page(\\d+)?', component: createListView('job') },
    { path: '/item/:id(\\d+)', component: ItemView },
    { path: '/user/:id', component: UserView },
    { path: '/', redirect: '/top' }
  ]
})
