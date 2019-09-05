
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
    },
    clearError: ({ commit }) => {
      commit('clearError')
    }
  }
}
