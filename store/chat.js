import axios from 'axios'

export const state = () => ({
  chats: [],
  chat: {},
  messages: [],
  offset: 0,
  allMessagesLoaded: false,
})

export const getters = {
  total(state) {
    return state.chats.reduce((a, b) => a + (b.unread || 0), 0)
  },
}

export const mutations = {
  setChats(state, chats) {
    state.chats = chats
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
    if (state.chat.chatid === notificationMessage.chatId) {
      state.messages.push(notificationMessage)
    } else {
      const index = state.chats.findIndex(
        (chat) => chat.chatId === notificationMessage.chatId
      )
      if (index !== -1) state.chats[index].unread += 1
    }
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
  async getChat({ commit }, chatId) {
    try {
      const { data } = await axios.get(
        `${process.env.SOCKET_URL}/chat/user/${chatId}`
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
        `${process.env.SOCKET_URL}/group/${groupId}`
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
        `${process.env.SOCKET_URL}/group/${groupId}`
      )
      return data
    } catch (err) {
      console.error(err)
      return {}
    }
  },
  async getGroups(_) {
    try {
      const { data } = await axios.get(`${process.env.SOCKET_URL}/groups`)
      return data
    } catch (err) {
      console.error(err)
    }
  },
  async getMessages({ state, commit }, { chatId }) {
    if (state.allMessagesLoaded) return
    try {
      const { data } = await axios.get(
        `${process.env.SOCKET_URL}/chat/messages/${chatId}?cursor=${state.messages[0].message_id}`
      )
      commit('setMessages', data)
    } catch (err) {
      console.error(err)
    }
  },
  async createMessage({ rootState, commit }, message) {
    try {
      await axios.post(`${process.env.SOCKET_URL}/chat/send`, message)
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
      await axios.post(`${process.env.SOCKET_URL}/group/new`, group)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
