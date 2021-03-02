import axios from 'axios'

export const state = () => ({
  user: {},
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}

export const getters = {
  authenticated(state) {
    return Object.keys(state.user).length !== 0
  },
}

export const actions = {
  async checkLogged({ dispatch }) {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common.authorization = 'Bearer ' + token
      return await dispatch('getMe')
    }
    return false
  },
  async login({ dispatch }, body) {
    try {
      const { data: token } = await axios.post(
        `${process.env.SOCKET_URL}/login`,
        body
      )
      axios.defaults.headers.common.authorization = 'Bearer ' + token
      localStorage.setItem('token', token)
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async signup({ dispatch }, body) {
    try {
      const { data: token } = await axios.post(
        `${process.env.SOCKET_URL}/signup`,
        body
      )

      axios.defaults.headers.common.authorization = 'Bearer ' + token
      localStorage.setItem('token', token)
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async getMe({ commit, dispatch }) {
    try {
      const { data: user } = await axios.get(
        `${process.env.SOCKET_URL}/user/me`
      )
      commit('setUser', user)
      dispatch('chat/getChats', {}, { root: true })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
