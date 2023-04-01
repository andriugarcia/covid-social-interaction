import axios from '../axios'
import socket from '../socket'

axios.defaults.withCredentials = true;

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
  logChecked: false,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  restartPortals(state) {
    state.portals = [
      defaultPortal
    ]
  },
  setPortals(state, portals) {

    state.portals.push(...Object.values(portals))

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
  setLoginToken(_, token) {
    axios.defaults.headers.common.authorization = 'Bearer ' + token
    localStorage.setItem('token', token)
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
  async checkLogged({ state, dispatch }) {
    if (state.logChecked) return
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common.authorization = 'Bearer ' + token
    }

    try {
      state.logChecked = true
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      return false
    }
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
    // localStorage.removeItem('pushToken')
    commit('setPushEnabled', false)
    commit('setUser', {})
    commit('setPortals', [])
    axios.get(`${process.env.SERVER_URL}/logout`)
    this.app.$fire.analytics.logEvent('logout')
  },
  async login({ dispatch }, body) {

    try {
      const { data: token } = await axios.post(
        `${process.env.SERVER_URL}/login`,
        body
      )
      axios.defaults.headers.common.authorization = 'Bearer ' + token
      localStorage.setItem('token', token)
      this.app.$fire.analytics.logEvent('login', {
        method: 'Email'
      })
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async sendConfirmationEmail() {
    try {
      await axios.post(
        `${process.env.SERVER_URL}/user/sendConfirmationEmail`,
      )
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async verifyUser() {
    try {
      await axios.post(
        `${process.env.SERVER_URL}/user/verify`,
      )
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async recoverPassword(_, email) {
    try {
      await axios.post(
        `${process.env.SERVER_URL}/user/recoverPassword/${email}`,
      )
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async loginPhone({ dispatch }, body) {

    try {
      const { data: token } = await axios.post(
        `${process.env.SERVER_URL}/login/phone`,
        body
      )
      axios.defaults.headers.common.authorization = 'Bearer ' + token
      localStorage.setItem('token', token)
      this.app.$fire.analytics.logEvent('login', {
        method: 'Phone'
      })
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async signupByPhone({ dispatch }, body) {
    try {
      const { data: token } = await axios.post(
        `${process.env.SERVER_URL}/signup/phone`,
        body
      )


      axios.defaults.headers.common.authorization = 'Bearer ' + token
      localStorage.setItem('token', token)
      this.app.$fire.analytics.logEvent('sign_up', {
        method: 'Phone'
      })
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },
  async signupByEmail({ dispatch }, body) {
    try {
      const { data: token } = await axios.post(
        `${process.env.SERVER_URL}/signup/email`,
        body
      )


      axios.defaults.headers.common.authorization = 'Bearer ' + token
      localStorage.setItem('token', token)
      this.app.$fire.analytics.logEvent('sign_up', {
        method: 'Email'
      })
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      throw new Error(err)
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
      this.app.$fire.analytics.logEvent('sign_up', {
        method: 'Email'
      })
      return await dispatch('getMe')
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getPortals({ commit }, page) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/portals/${page}`)


      commit('setPortals', data)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async updatePassword(_, password) {
    try {
      await axios.post(`${process.env.SERVER_URL}/user/updatePassword`, { password })
      this.app.$fire.analytics.logEvent('updatePassword')
      return true
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }

  },
  async getMe({ state, commit, dispatch }) {
    console.log(process.env.SERVER_URL);
    try {
      const { data: user } = await axios.get(
        `${process.env.SERVER_URL}/user/me`
      )
      commit('setUser', user)

      dispatch('chat/getChats', {}, { root: true })
      if (state.portals.length <= 1) {
        dispatch('getPortals')
      }

      // socket.emit('join', {
      //   profile_id: user.profile_id,
      // })

      socket.on('chatnotification', (message) => {
        console.log('IN APP CHAT MESSAGE', message)
        commit('chat/chatNotification', message, { root: true })
        commit('setNotification', {
          type: 'chat', image: message.profile.profile_picture, title: message.profile.username, text: message.text,
          link: '/chat/' + message.channel
        })
      })

      socket.on('notification', (notification) => {
        console.log('IN APP NOTIFICATION', notification)
        commit('setNotification', notification)
      })



      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
