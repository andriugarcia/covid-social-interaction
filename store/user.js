import axios from '../axios'

export const state = () => ({
  rrssContacts: []
})

export const mutations = {
  setRrssContacts(state, data) {
    state.rrssContacts = data
  }
}

export const actions = {
  async getUser(_, { username, page }) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/users/${username}/${page}`
      )
      return data
    } catch (err) {
      console.error(err)
      return null
      throw new Error(err)
    }
  },
  async getNotifications(_, page) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/user/notifications/${page}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async getFollowers(_) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/user/followers`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async getPeople(_) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/people`)
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async getRrssContacts({ commit }) {
    const lastRrssChecked = localStorage.getItem('lastRrssChecked')

    if (lastRrssChecked) {
      const date = new Date(lastRrssChecked * 1)
      const diff = new Date() - date

      // Comprobamos si la última comprobación ha sido hace menos de una semana
      if (diff < (3600000 * 24 * 7)) {
        return
      }
    }
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/user/rrssContacts`)
      commit('setRrssContacts', data.map(contact => ({
        ...contact,
        follow: false,
      })))
      localStorage.setItem('lastRrssChecked', Date.now())
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },
  async userAutocomplete(_, searchText) {
    try {
      const { data } = await axios.get(`
        ${process.env.SERVER_URL}/users/find/${searchText}
      `)
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async findUsers(_, text) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/users/find/${text}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async follow(_, userId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/follow/${userId}`)
      this.app.$fire.analytics.logEvent('follow', {
        user_id: userId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async unfollow(_, userId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/unfollow/${userId}`)
      this.app.$fire.analytics.logEvent('unfollow', {
        user_id: userId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async updateProfile({ commit }, profile) {
    try {
      await axios.post(`${process.env.SERVER_URL}/user/updateProfile`, profile)
      commit('auth/updateProfile', profile, { root: true })
      return true
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },
  async updateProfilePicture(_, profilePicture) {
    try {
      await axios.post(`${process.env.SERVER_URL}/user/updateProfilePicture`, {
        profilePicture,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async readNotifications({ rootState }) {
    try {
      rootState.auth.user.notifications = rootState.auth.user.notifications.map(notification => ({
        ...notification,
        read: true,
      }))
      await axios.post(`${process.env.SERVER_URL}/user/readNotifications`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async sendNotificationToken(_, token) {
    try {
      await axios.post(`${process.env.SERVER_URL}/subscribePushClient`, {
        token
      })

      return true
    } catch (err) {
      console.error(err)
      return false
    }

  }
}
