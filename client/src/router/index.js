import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import HomeAdmin from '@/views/HomeAdmin'
import PageNotFound from '@/components/PageNotFound'
import store from '@/store/'
import DashboardBookkeeper from '@/views/DashboardBookkeeper'

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
          next('/dashboard/bookkeeper')
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
          next('/dashboard/bookkeeper')
        } else {
          next()
        }
      },
      component: HomeAdmin
    },
    {
      path: '/dashboard/bookkeeper',
      name: 'dashboard',
      component: DashboardBookkeeper,
      meta: {
        title: 'Dashboard'
      }
    },
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
