export default {
  isLogged: state => {
    return state.isAuthenticated === true
  },
  isBookkeeper: state => {
    return state.user.account === 'bookkeeper'
  },
  isAdmin: state => {
    return state.user.account === 'admin'
  }
}
