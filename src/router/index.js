import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

import { createListView } from '../views/CreateListView'
import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) { 
    if (savedPosition && to.name) { 
      // to.name && Vue.set(store.state.scrollPosition, to.name, savedPosition);
      store.commit('SET_SCROLL', {
        type: to.name,
        scrollPosition: savedPosition
      });
      return false
    };
    return {
      y: 0
    };
  },
  routes: [
    { path: '/top/:page(\\d+)?', component: createListView('top'), name: 'top' },
    { path: '/new/:page(\\d+)?', component: createListView('new'), name: 'new' },
    { path: '/show/:page(\\d+)?', component: createListView('show'), name: 'show' },
    { path: '/ask/:page(\\d+)?', component: createListView('ask'), name: 'ask' },
    { path: '/job/:page(\\d+)?', component: createListView('job'), name: 'job' },
    { path: '/item/:id(\\d+)', component: ItemView, name: 'item'},
    { path: '/user/:id', component: UserView, name: 'user'},
    { path: '/', redirect: '/top' }
  ]
})
