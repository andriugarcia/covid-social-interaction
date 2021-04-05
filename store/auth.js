import axios from 'axios'
import io from 'socket.io-client'
const socket = io(process.env.SOCKET_URL)

export const state = () => ({
  user: {},
  portals: {},
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setPortals(state, portals) {
    state.portals = Object.values(portals)
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
  initAuthError({ dispatch }, router) {
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      function (error) {
        if (error.response.status === 405) {
          dispatch('logout')
          router.replace({ path: '/' })
        }
        return Promise.reject(error)
      }
    )
  },
  logout({ commit }) {
    delete axios.defaults.headers.common.authorization
    localStorage.removeItem('token')
    commit('setUser', {})
  },
  async login({ dispatch }, body) {
    try {
      const { data: token } = await axios.post(
        `${process.env.SERVER_URL}/login`,
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
        `${process.env.SERVER_URL}/signup`,
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
  async getPortals({ commit }) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/portals`)

      commit('setPortals', data)
    } catch (err) {
      console.error(err)
    }
  },
  async getMe({ rootState, commit, dispatch }) {
    try {
      const { data: user } = await axios.get(
        `${process.env.SERVER_URL}/user/me`
      )
      commit('setUser', user)
      dispatch('chat/getChats', {}, { root: true })
      dispatch('chat/getCloseChats', rootState.map.userPosition, { root: true })
      dispatch('getPortals')

      socket.emit('join', {
        profile_id: user.profile_id,
      })

      socket.on('chatnotification', (message) => {
        commit('chat/chatNotification', message, { root: true })
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
