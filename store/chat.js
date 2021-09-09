import axios from '../axios'
import socket from '../socket'

export const state = () => ({
  chats: [],
  closeChats: [],
  chat: {},
  messages: [],
  nearbyMessages: [],
  newMessages: 0,
  nearbyTotal: 0,
  allMessagesLoaded: false,
  nearbyEnabled: false,
})

export const getters = {
  total(state) {
    return state.chats.reduce((a, b) => a + (b.unread ? 1 : 0), 0) + state.nearbyTotal
  },
  totalClose(state) {
    return state.closeChats.length
  },
  isParticipant(state, _, rootState) {
    if (state.chat.type !== 'group') return true

    const index = state.chat.member.findIndex(
      (member) => member.profile_id === rootState.auth.user.profile_id
    )
    return index !== -1
  },
  isParticipantInGroup: (state) => (chat_id) => {
    const index = state.chats.findIndex((chat) => {
      if (chat.chat.type !== 'group') return false
      return chat.chat_id === chat_id
    })
    return index !== -1
  },
  removeChat(state, chatId) {
    const index = state.chats.findIndex((chat) => chat.chat_id === chatId)
    state.chats.splice(index, 1)
  },
  getChatIdFromUsername: (state) => (username) => {
    console.log(state.chats)
    const index = state.chats.findIndex(
      (chat) => {
        if (chat.chat.type !== 'chat') return false
        if (typeof chat.chat.member[1] === 'undefined') return false

        return chat.chat.member[0].profile.username === username || chat.chat.member[1].profile.username === username
      }
    )

    if (index !== -1) {
      return state.chats[index].chat_id
    } else {
      return null
    }
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
  pushNearbyMessage(state, message) {
    state.nearbyMessages.push(message)
    state.nearbyTotal += 1
    localStorage.setItem('nearbyMessages', JSON.stringify(state.nearbyMessages))
  },
  closeChat(state) {
    state.chat = {}
    state.messages.length = 0
    state.offset = 0
    state.allMessagesLoaded = false
  },
  loadNearbyMessages(state) {
    state.nearbyMessages = JSON.parse(localStorage.getItem('nearbyMessages')) || []
  },
  chatNotification(state, notificationMessage) {
    if (state.chat.chat_id === notificationMessage.channel) {
      state.messages.push(notificationMessage)
      state.newMessages++
    } else {
      const index = state.chats.findIndex(
        (chat) => chat.chat_id === notificationMessage.channel
      )
      if (index !== -1) state.chats[index].unread += 1
    }
  },
  readNearby(state) {
    state.nearbyTotal = 0
  }
}

export const actions = {
  async share({ commit }, shareContent) {
    try {
      await axios.post(`${process.env.SERVER_URL}/group/share/${shareContent.chat}`, {
        targets: shareContent.targets,
      })
      commit('setShareCreated', true, { root: true })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  joinNearby({ rootState, commit }) {

    socket.emit('join-nearby', {
      user: rootState.auth.user,
      coordinates: rootState.map.userPosition,
    })

    socket.on('message', (message) => {

      commit('pushNearbyMessage', message)
    })
    socket.on('disconnected', (message) => {

      socket.disconnect()
    })
  },
  updateNearbyPosition({ rootState }) {
    socket.emit('move', {
      coordinates: rootState.map.userPosition,
    })
  },
  createNearbyMessage({ commit, rootState }, message) {

    socket.emit('send-nearby', {
      ...message,
      coordinates: rootState.map.userPosition,
      created_at: Date.now(),
      profile: rootState.auth.user,
      author: rootState.auth.user.profile_id
    })
    commit('pushNearbyMessage', {
      ...message,
      created_at: Date.now(),
      profile: rootState.auth.user,
      author: rootState.auth.user.profile_id
    })
  },
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
  async searchGroups({ rootState }, search) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/chats/search?search=${search}&lat=${rootState.map.userPosition.lat}&lng=${rootState.map.userPosition.lng}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async getCloseChats({ commit, rootState }) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/chats/close?lat=${rootState.map.userPosition.lat}&lng=${rootState.map.userPosition.lng}`
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
      throw new Error(err)
    }
  },
  async muteChat({ commit }, chatId) {
    try {
      await axios.get(`${process.env.SERVER_URL}/chat/${chatId}/mute`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async unmuteChat({ commit }, chatId) {
    try {
      await axios.get(`${process.env.SERVER_URL}/chat/${chatId}/unmute`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getGroupEvents({ commit }, groupId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/group/${groupId}/events`
      )

      return data
    } catch (err) {
      console.error(err)
    }
  },
  async getGroupPosts({ commit }, groupId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/group/${groupId}/posts`
      )

      return data
    } catch (err) {
      console.error(err)
    }
  },
  async getGroupMedia({ commit }, groupId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/group/${groupId}/media`
      )

      return data
    } catch (err) {
      console.error(err)
    }
  },
  async getGroup({ commit, rootState }, groupId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/group/${groupId}`
      )

      const { messages, ...chat } = data
      console.log(messages)
      commit('setMessages', messages)
      commit('setChat', {
        ...chat,
        about: chat.member.find(
          (member) => member.profile_id === rootState.auth.user.profile_id
        ),
      })
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
      const { data } = await axios.post(`${process.env.SERVER_URL}/chat/send`, message)
      commit('pushMessage', {
        ...message,
        author: rootState.auth.user.profile_id,
        created_at: Date.now(),
      })
      this.app.$fire.analytics.logEvent('new_message', {
        chat_id: message.chat_ref,
        author: rootState.auth.user.profile_id,
      })
      return data
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async createGroup(_, group) {
    try {
      const { data } = await axios.post(`${process.env.SERVER_URL}/group/new`, group)
      this.app.$fire.analytics.logEvent('new_group', {
        chat_id: data,
        name: data.title,
      })
      return data
    } catch (err) {
      console.error(err)
      return null
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
  async addParticipants({ state }, participants) {
    console.log(state.chat.chat_id, participants)
    try {
      await axios.post(`${process.env.SERVER_URL}/chat/${state.chat.chat_id}/addParticipants`, {
        participants,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async removeParticipant(_, { chat_id, profile_id }) {
    try {
      await axios.post(`${process.env.SERVER_URL}/chat/${chat_id}/removeParticipant`, {
        profile_id,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async addAdmin(_, { chatId, memberId }) {
    try {
      await axios.post(`${process.env.SERVER_URL}/chat/${chatId}/makeAdmin`, {
        profile_id: memberId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async removeAdmin(_, { chatId, memberId }) {
    try {
      await axios.post(`${process.env.SERVER_URL}/chat/${chatId}/removeAdmin`, {
        profile_id: memberId,
      }
      )
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async leaveGroup({ commit }, chatId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/chat/${chatId}/leave`)
      commit('chat/removeChat', chatId)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async updateCover(_, { chatId, cover }) {
    try {
      await axios.post(
        `${process.env.SERVER_URL}/chat/${chatId}/updateCover`, { cover, }
      )
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async updateChat(_, { chatId, chat }) {
    try {
      await axios.post(
        `${process.env.SERVER_URL}/chat/${chatId}/updateChat`,
        chat
      )
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
