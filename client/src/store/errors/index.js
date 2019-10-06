
export default {
  namespaced: true,
  state: {
    isError: false,
    msg: ''
  },
  mutations: {
    error: (state, payload) => {
      state.isError = true
      state.msg = payload
    },
    clearError: (state) => {
      state.isError = false
      state.msg = ''
    }
  },
  actions: {
    getError: ({ commit }, payload) => {
      commit('error', payload)
      setTimeout(() => {
        commit('clearError')
      }, 2000)
    },
    clearError: ({ commit }) => {
      commit('clearError')
    }
  },
  getters: {
    errorMsg: state => {
      return state.msg
    }
  }
}
