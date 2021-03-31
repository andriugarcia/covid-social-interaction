import axios from 'axios'

export const state = () => ({
  chats: [],
  closeChats: [],
  chat: {},
  messages: [],
  offset: 0,
  allMessagesLoaded: false,
})

export const getters = {
  total(state) {
    return state.chats.reduce((a, b) => a + (b.unread || 0), 0)
  },
  totalClose(state) {
    return state.closeChats.length
  },
}

export const mutations = {
  setChats(state, chats) {
    state.chats = chats
  },
  setCloseChats(state, chats) {
    state.closeChats = chats
  },
  setChat(state, chat) {
    state.chat = chat
  },
  setMessages(state, messages) {
    state.messages = [...messages.reverse(), ...state.messages]
    state.offset = state.messages.length
    if (state.offset % 20 !== 0) state.allMessagesLoaded = true
  },
  pushMessage(state, message) {
    state.messages.push(message)
  },
  closeChat(state) {
    state.chat = {}
    state.messages.length = 0
    state.offset = 0
    state.allMessagesLoaded = false
  },
  chatNotification(state, notificationMessage) {
    if (state.chat.chat_id === notificationMessage.channel) {
      console.log('PUSH')
      state.messages.push(notificationMessage)
    } else {
      const index = state.chats.findIndex(
        (chat) => chat.chat_id === notificationMessage.channel
      )
      if (index !== -1) state.chats[index].unread += 1
    }
  },
}

export const actions = {
  async getChats({ commit }) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/chats`)
      commit('setChats', data)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getCloseChats({ commit }, coordinates) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/chats/close?lat=${coordinates.lat}&lng=${coordinates.lng}`
      )
      commit('setCloseChats', data)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getChat({ commit }, chatId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/chat/user/${chatId}`
      )

      const { messages, chat } = data
      commit('setMessages', messages)
      commit('setChat', chat)
    } catch (err) {
      console.error(err)
    }
  },
  async getGroup({ commit }, groupId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/group/${groupId}`
      )

      const { messages, ...chat } = data
      commit('setMessages', messages)
      commit('setChat', chat)
    } catch (err) {
      console.error(err)
    }
  },
  async getGroupForMap(_, groupId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/group/${groupId}`
      )
      return data
    } catch (err) {
      console.error(err)
      return {}
    }
  },
  async getGroups(_) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/groups`)
      return data
    } catch (err) {
      console.error(err)
    }
  },
  async getGroupsAdmin(_) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/groups/admin`)
      return data
    } catch (err) {
      console.error(err)
    }
  },
  async getMessages({ state, commit }, { chatId }) {
    if (state.allMessagesLoaded) return
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/chat/messages/${chatId}?cursor=${state.messages[0].message_id}`
      )
      commit('setMessages', data)
    } catch (err) {
      console.error(err)
    }
  },
  async createMessage({ rootState, commit }, message) {
    try {
      await axios.post(`${process.env.SERVER_URL}/chat/send`, message)
      commit('pushMessage', {
        ...message,
        author: rootState.auth.user.profile_id,
        created_at: Date.now(),
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async createGroup(_, group) {
    try {
      await axios.post(`${process.env.SERVER_URL}/group/new`, group)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async joinChat(_, chatId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/groups/join/${chatId}`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
