import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import PageNotFound from '@/components/PageNotFound'
import Dashboard from '@/views/Dashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      // beforeEnter (to, from, next) {
      //   if (store.getters['auth/isLogged']) {
      //     next('/dashboard')
      //   } else {
      //     next()
      //   }
      // },
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // beforeEnter (to, from, next) {
      //   if (store.getters['auth/isLogged']) {
      //     next()
      //   } else {
      //     next('/')
      //   }
      // },
      component: Dashboard,
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
