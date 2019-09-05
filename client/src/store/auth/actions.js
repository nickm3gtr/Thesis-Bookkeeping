import axios from 'axios'
export default {
  registerUser: ({ commit, dispatch }, payload) => {
    const { firstName, lastName, email, password } = payload
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const newUser = JSON.stringify({
      firstName,
      lastName,
      email,
      password
    })

    axios.post('http://localhost:5000/bookkeepers', newUser, config)
      .then(response => commit('AUTH_USER', response.data))
      .catch(err => {
        commit('LOGOUT_USER')
        dispatch('errors/getError', err.response.data, { root: true })
      })
  },
  loginUser: ({ commit, dispatch }, payload) => {
    const { email, password } = payload
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const user = JSON.stringify({
      email,
      password
    })
    axios.post('http://localhost:5000/bookkeepers/login', user, config)
      .then(response => commit('AUTH_USER', response.data))
      .catch(err => {
        commit('LOGOUT_USER')
        dispatch('errors/getError', err.response.data, { root: true })
      })
  },
  loadUser: ({ commit }) => {
    commit('USER_LOADING')
    const config = {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
    axios.get('http://localhost:5000/bookkeepers', config)
      .then(response => {
        commit('USER_LOADED', response.data)
        // eslint-disable-next-line handle-callback-err
      }).catch(err => commit('LOGOUT_USER'))
  },
  logoutUser: ({ commit }) => {
    commit('LOGOUT_USER')
  }
}
