import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import HomeAdmin from '@/views/HomeAdmin'
import PageNotFound from '@/components/PageNotFound'
import store from '@/store/'

import dashboard from './dashboard'
import charts from './charts'
import generalJournal from './generalJournal'
import reports from './reports'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter (to, from, next) {
        if (store.getters['auth/isLogged']) {
          next('/bookkeeper/dashboard')
        } else {
          next()
        }
      },
      component: Home
    },
    {
      path: '/admin',
      name: 'homeAdmin',
      beforeEnter (to, from, next) {
        if (store.getters['auth/isLogged']) {
          next('/bookkeeper/dashboard')
        } else {
          next()
        }
      },
      component: HomeAdmin
    },
    ...dashboard,
    ...charts,
    ...generalJournal,
    ...reports,
    {
      path: '*',
      name: 'notFound',
      component: PageNotFound,
      meta: {
        title: 'Page Not Found'
      }
    }
  ]
})
