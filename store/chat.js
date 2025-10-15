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
    const index = state.chats.findIndex(
      (chat_element) => chat_element.chat_id === chat.chat_id
    )
    if (index !== -1) {
      state.chats[index].unread = 0
    }
  },
  setMessages(state, messages) {
    state.messages = [...messages.reverse(), ...state.messages]
    state.offset = state.messages.length
    if (state.offset % 20 !== 0) state.allMessagesLoaded = true
  },
  pushMessage(state, message) {
    state.messages.push(message)
    const index = state.chats.findIndex(
      (chat) => chat.chat_id === message.chatId
    )
    if (index !== -1) {
      state.chats[index].chat.message_chatTomessage_channel.unshift(message)
    }
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
      if (index !== -1) {
        state.chats[index].unread += 1
        state.chats[index].chat.message_chatTomessage_channel.unshift(notificationMessage)
      }
    }
  },
  readNearby(state) {
    state.nearbyTotal = 0
  }
}

export const actions = {
  async share({ commit }, shareContent) {
    // Demo mode - always succeed
    commit('setShareCreated', true, { root: true })
    return true
  },
  joinNearby({ rootState, commit }) {
    // Demo mode - simulate nearby messages
    const demoNearbyMessages = [
      {
        text: "Hello! Anyone around here?",
        type: "text",
        created_at: Date.now() - 300000,
        profile: {
          username: "nearby_user1",
          profile_picture: "https://picsum.photos/50/50?random=50"
        },
        author: "nearby-user-1"
      },
      {
        text: "What a beautiful day to go out",
        type: "text", 
        created_at: Date.now() - 600000,
        profile: {
          username: "nearby_user2",
          profile_picture: "https://picsum.photos/50/50?random=51"
        },
        author: "nearby-user-2"
      }
    ]
    
    demoNearbyMessages.forEach(message => {
      commit('pushNearbyMessage', message)
    })
  },
  updateNearbyPosition({ rootState }) {
    // Demo mode - no action needed
  },
  createNearbyMessage({ commit, rootState }, message) {
    // Add message to nearby in demo mode
    commit('pushNearbyMessage', {
      ...message,
      created_at: Date.now(),
      profile: rootState.auth.user,
      author: rootState.auth.user.profile_id
    })
  },
  async getChats({ commit }) {
    // Return hardcoded demo chats
    const demoChats = [
      {
        chat_id: 'chat-1',
        unread: 0,
        chat: {
          type: 'chat',
          title: 'Chat with Ana',
          cover: null,
          member: [
            {
              profile_id: 'demo-user-123',
              profile: {
                username: 'demo_user',
                profile_picture: 'https://picsum.photos/200/200?random=1'
              }
            },
            {
              profile_id: 'user-ana',
              profile: {
                username: 'ana_madrid',
                profile_picture: 'https://picsum.photos/200/200?random=30'
              }
            }
          ],
          message_chatTomessage_channel: [
            {
              message_id: 'msg-1',
              text: 'Hello! How are you?',
              type: 'text',
              created_at: Date.now() - 3600000,
              author: 'user-ana'
            }
          ]
        }
      },
      {
        chat_id: 'group-1',
        unread: 2,
        chat: {
          type: 'group',
          title: 'Demo Group Madrid',
          cover: 'https://picsum.photos/100/100?random=40',
          description: 'A demo group to explore Madrid',
          coordinates: { lat: 40.4168, lng: -3.7038 },
          member: [
            {
              profile_id: 'demo-user-123',
              profile: {
                username: 'demo_user',
                profile_picture: 'https://picsum.photos/200/200?random=1'
              },
              is_creator: true
            },
            {
              profile_id: 'user-ana',
              profile: {
                username: 'ana_madrid',
                profile_picture: 'https://picsum.photos/200/200?random=30'
              },
              is_creator: false
            },
            {
              profile_id: 'user-carlos',
              profile: {
                username: 'carlos_explore',
                profile_picture: 'https://picsum.photos/200/200?random=31'
              },
              is_creator: false
            }
          ],
          message_chatTomessage_channel: [
            {
              message_id: 'msg-group-1',
              text: 'Shall we meet this weekend?',
              type: 'text',
              created_at: Date.now() - 1800000,
              author: 'user-ana'
            },
            {
              message_id: 'msg-group-2',
              text: 'Perfect! I\'m in',
              type: 'text',
              created_at: Date.now() - 900000,
              author: 'user-carlos'
            }
          ]
        }
      }
    ]
    
    commit('setChats', demoChats)
    return true
  },
  async searchGroups({ rootState }, search) {
    // Return filtered demo groups based on search
    const demoGroups = [
      {
        chat_id: 'search-group-1',
        title: 'Explore Madrid Center',
        cover: 'https://picsum.photos/100/100?random=60',
        description: 'Group to explore Madrid center',
        member_count: 25
      },
      {
        chat_id: 'search-group-2', 
        title: 'Madrid Photographers',
        cover: 'https://picsum.photos/100/100?random=61',
        description: 'Community of photographers in Madrid',
        member_count: 42
      }
    ]
    
    return demoGroups.filter(group => 
      group.title.toLowerCase().includes(search.toLowerCase()) ||
      group.description.toLowerCase().includes(search.toLowerCase())
    )
  },
  async getCloseChats({ commit, rootState }) {
    // Return demo nearby chats
    const demoCloseChats = [
      {
        chat_id: 'close-group-1',
        title: 'Retiro Group',
        cover: 'https://picsum.photos/100/100?random=70',
        distance: '0.5 km',
        member_count: 15
      },
      {
        chat_id: 'close-group-2',
        title: 'Sol Meetups',
        cover: 'https://picsum.photos/100/100?random=71', 
        distance: '1.2 km',
        member_count: 28
      }
    ]
    
    commit('setCloseChats', demoCloseChats)
    return true
  },
  async getChat({ commit }, chatId) {
    // Return demo chat data
    const demoChat = {
      chat_id: chatId,
      type: 'chat',
      title: 'Demo Chat',
      member: [
        {
          profile_id: 'demo-user-123',
          profile: {
            username: 'demo_user',
            profile_picture: 'https://picsum.photos/200/200?random=1'
          }
        },
        {
          profile_id: 'user-other',
          profile: {
            username: 'other_user',
            profile_picture: 'https://picsum.photos/200/200?random=32'
          }
        }
      ]
    }
    
    const demoMessages = [
      {
        message_id: 'demo-msg-1',
        text: 'Hello, how are you?',
        type: 'text',
        created_at: Date.now() - 3600000,
        author: 'user-other'
      },
      {
        message_id: 'demo-msg-2',
        text: 'Very well! And you?',
        type: 'text',
        created_at: Date.now() - 3000000,
        author: 'demo-user-123'
      }
    ]
    
    commit('setMessages', demoMessages)
    commit('setChat', demoChat)
  },
  async muteChat({ commit }, chatId) {
    // Demo mode - always succeed
    return true
  },
  async unmuteChat({ commit }, chatId) {
    // Demo mode - always succeed
    return true
  },
  async getGroupEvents({ commit }, groupId) {
    // Return demo group events
    return [
      {
        event_id: 'group-event-1',
        title: 'Group Event',
        category: '🎉',
        date: Date.now() + 86400000,
        description: 'An event organized by the group'
      }
    ]
  },
  async getGroupPosts({ commit }, groupId) {
    // Return demo group posts
    return [
      {
        post_id: 'group-post-1',
        text: 'Group post',
        type: 'text',
        created_at: Date.now() - 3600000,
        likes: 5
      }
    ]
  },
  async getGroupMedia({ commit }, groupId) {
    // Return demo group media
    return [
      {
        media_id: 'group-media-1',
        type: 'image',
        src: 'https://picsum.photos/400/300?random=80',
        created_at: Date.now() - 7200000
      }
    ]
  },
  async getGroup({ commit, rootState }, groupId) {
    // Return demo group data
    const demoGroup = {
      chat_id: groupId,
      type: 'group',
      title: 'Demo Group',
      cover: 'https://picsum.photos/100/100?random=40',
      description: 'A demo group',
      coordinates: { lat: 40.4168, lng: -3.7038 },
      member: [
        {
          profile_id: 'demo-user-123',
          profile: {
            username: 'demo_user',
            profile_picture: 'https://picsum.photos/200/200?random=1'
          },
          is_creator: true
        }
      ],
      about: {
        profile_id: 'demo-user-123',
        is_creator: true
      }
    }
    
    const demoMessages = [
      {
        message_id: 'group-msg-1',
        text: 'Group message',
        type: 'text',
        created_at: Date.now() - 3600000,
        author: 'demo-user-123'
      }
    ]
    
    commit('setMessages', demoMessages)
    commit('setChat', demoGroup)
  },
  async getGroupForMap(_, groupId) {
    // Return demo group for map
    return {
      chat_id: groupId,
      title: 'Demo Group',
      coordinates: { lat: 40.4168, lng: -3.7038 },
      member_count: 5
    }
  },
  async getGroups(_) {
    // Return demo groups
    return [
      {
        chat_id: 'group-demo-1',
        title: 'Grupo Demo 1',
        cover: 'https://picsum.photos/100/100?random=90',
        member_count: 10
      },
      {
        chat_id: 'group-demo-2',
        title: 'Grupo Demo 2',
        cover: 'https://picsum.photos/100/100?random=91',
        member_count: 15
      }
    ]
  },
  async getGroupsAdmin(_) {
    // Return demo admin groups
    return [
      {
        chat_id: 'admin-group-1',
        title: 'Grupo Admin Demo',
        cover: 'https://picsum.photos/100/100?random=95',
        member_count: 8
      }
    ]
  },
  async getMessages({ state, commit }, { chatId }) {
    if (state.allMessagesLoaded) return
    // Return demo messages for pagination
    const demoMessages = [
      {
        message_id: 'old-msg-1',
        text: 'Previous message',
        type: 'text',
        created_at: Date.now() - 86400000,
        author: 'user-other'
      }
    ]
    commit('setMessages', demoMessages)
  },
  async createMessage({ rootState, commit, dispatch }, message) {
    // Demo mode - add message locally
    commit('pushMessage', {
      ...message,
      author: rootState.auth.user.profile_id,
      created_at: Date.now(),
      message_id: 'new-msg-' + Date.now()
    })
    
    if (typeof message.userId !== 'undefined') {
      dispatch('getChats')
    }
    
    return { message_id: 'new-msg-' + Date.now() }
  },
  async createGroup(_, group) {
    // Demo mode - always succeed
    const newGroupId = 'new-group-' + Date.now()
    return { chat_id: newGroupId, title: group.title }
  },
  async joinChat(_, chatId) {
    // Demo mode - always succeed
    return true
  },
  async addParticipants({ state }, participants) {
    // Demo mode - always succeed
    return true
  },
  async removeParticipant(_, { chat_id, profile_id }) {
    // Demo mode - always succeed
    return true
  },
  async addAdmin(_, { chatId, memberId }) {
    // Demo mode - always succeed
    return true
  },
  async removeAdmin(_, { chatId, memberId }) {
    // Demo mode - always succeed
    return true
  },
  async leaveGroup({ commit }, chatId) {
    // Demo mode - always succeed
    return true
  },
  async updateCover(_, { chatId, cover }) {
    // Demo mode - always succeed
    return true
  },
  async updateChat(_, { chatId, chat }) {
    // Demo mode - always succeed
    return true
  },
}
