import axios from 'axios'
import router from '@/router/'
// import state from '@/store/'

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

    axios.post('/api/bookkeepers', newUser, config)
      .then(response => commit('AUTH_USER', response.data))
      .catch(err => {
        commit('LOGOUT_USER')
        dispatch('errors/getError', err.response.data, { root: true })
      })
  },
  loginUser: ({ commit, dispatch }, payload) => {
    commit('USER_LOADING')
    const { userName, password } = payload
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const user = JSON.stringify({
      userName,
      password
    })
    axios.post('/api/bookkeepers/login', user, config)
      .then(response => {
        commit('AUTH_USER', response.data)
        router.push('/bookkeeper/dashboard')
      })
      .catch(err => {
        commit('LOGOUT_USER')
        dispatch('errors/getError', err.response.data, { root: true })
      })
  },
  loginAdmin: ({ commit, dispatch }, payload) => {
    commit('USER_LOADING')
    const { userName, password } = payload
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const user = JSON.stringify({
      userName,
      password
    })
    axios.post('/api/admin/login', user, config)
      .then(response => {
        commit('AUTH_USER', response.data)
        router.push('/admin/dashboard')
      })
      .catch(err => {
        commit('LOGOUT_USER')
        dispatch('errors/getError', err.response.data, { root: true })
      })
  },
  loadUser: ({ commit, state }) => {
    commit('USER_LOADING')
    const config = {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
    if (state.user.account === 'bookkeeper') {
      axios.get('/api/bookkeepers', config)
        .then(response => {
          commit('USER_LOADED', response.data)
          // eslint-disable-next-line handle-callback-err
        }).catch(err => commit('LOGOUT_USER'))
    } else {
      axios.get('/api/admin', config)
        .then(response => {
          commit('USER_LOADED', response.data)
          // eslint-disable-next-line handle-callback-err
        }).catch(err => commit('LOGOUT_USER'))
    }
  },
  logoutUser: ({ commit }) => {
    commit('LOGOUT_USER')
  }
}
