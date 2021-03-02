import axios from 'axios'

export const state = () => ({
  chats: [],
})

export const mutations = {
  setChats(state, chats) {
    state.chats = chats
  },
}

export const actions = {
  async getChats({ commit }) {
    try {
      const { data } = await axios.get(`${process.env.SOCKET_URL}/chats`)
      commit('setChats', data)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getMessages(_, chatId) {
    try {
      console.log(chatId)
      const { data } = await axios.get(
        `${process.env.SOCKET_URL}/chat/${chatId}`
      )
      console.log(data)
      return data.reverse()
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async createMessage(_, message) {
    try {
      await axios.post(`${process.env.SOCKET_URL}/chat/send`, message)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
