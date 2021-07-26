import axios from 'axios'
import socket from '../socket'

const defaultPortal = {
  audience: 0,
  coordinates: null,
  created_at: Date.now(),
  event: null,
  is_liked: false,
  is_saved: false,
  likes: 0,
  opened: 0,
  permanent: false,
  post_id: null,
  profile_id: null,
  profile_picture: "https://olimaps.com/olimaps.gif",
  score: null,
  shared: 0,
  src: "",
  text: "Esto es un post por defecto, cambiar por un video",
  type: "short",
  info: true,
  url: null,
  username: "olimaps"
}

export const state = () => ({
  user: {},
  portals: [
    defaultPortal,
  ],
  newNotification: null,
  pushEnabled: false,
  pushAvailable: false,
})

export const mutations = {
  setUser(state, user) {
    state.user = user

  },
  setPortals(state, portals) {
    console.log(portals)
    state.portals = [
      defaultPortal,
      ...Object.values(portals),
    ]
  },
  setPushEnabled(state, pushEnabled) {
    state.pushEnabled = pushEnabled
  },
  setPushAvailable(state, pushAvailable) {
    state.pushAvailable = pushAvailable
  },
  setNotification(state, newNotification) {
    state.user.notifications.unshift(newNotification)
    state.newNotification = newNotification

    console.log("showing notification")
    setTimeout(() => {
      state.newNotification = null
    }, 8000)
  },
  closeNewNotification(state) {
    state.newNotification = null
  },
  updateProfile(state, updatedProfile) {
    Object.assign(state.user, updatedProfile)
  },
}

export const getters = {
  authenticated(state) {
    return Object.keys(state.user).length !== 0
  },
  totalNotifications(state, getters) {
    if (!getters.authenticated) return 0
    return state.user.notifications.reduce((a, b) => a + (b.read ? 0 : 1), 0)
  },
  hasPortals(state, getters) {
    return true
    // return getters.authenticated
    // return state.portals.length > 0 || state.user.participation.length > 0
  }
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
    localStorage.removeItem('pushToken')
    commit('setPushEnabled', false)
    commit('setUser', {})
    commit('setPortals', [])
  },
  async login({ dispatch }, body) {
    console.log('LOGIN');
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
  async getMe({ commit, dispatch }) {
    try {
      const { data: user } = await axios.get(
        `${process.env.SERVER_URL}/user/me`
      )
      commit('setUser', user)
      console.log("USER", user)
      dispatch('chat/getChats', {}, { root: true })
      dispatch('getPortals')

      // socket.emit('join', {
      //   profile_id: user.profile_id,
      // })

      socket.on('chatnotification', (message) => {
        commit('chat/chatNotification', message, { root: true })
      })

      socket.on('notification', (notification) => {
        console.log('Notificacion recibida')
        commit('setNotification', notification)
      })

      console.log(user)

      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
