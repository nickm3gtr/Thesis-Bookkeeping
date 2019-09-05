import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import errors from './errors'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    errors
  },
  plugins: [createPersistedState()]
})
