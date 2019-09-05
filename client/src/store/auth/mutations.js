export default {
  AUTH_USER: (state, payload) => {
    localStorage.setItem('token', payload.token)
    state.token = payload.token
    state.isLoading = false
    state.isAuthenticated = true
    state.user = payload.user
  },
  LOGOUT_USER: state => {
    localStorage.removeItem('token')
    state.token = null
    state.user = null
    state.isAuthenticated = false
    state.isLoading = false
  },
  USER_LOADED: (state, payload) => {
    state.isLoading = false
    state.isAuthenticated = true
    state.user = payload
    state.token = payload.token
  },
  USER_LOADING: state => {
    state.isLoading = true
  }
}
