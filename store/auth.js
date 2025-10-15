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

// Hardcoded demo user data
const demoUser = {
  profile_id: 'demo-user-123',
  username: 'demo_user',
  name: 'Demo User',
  email: 'demo@olimaps.com',
  profile_picture: 'https://picsum.photos/200/200?random=1',
  description: '¡Hola! Soy un usuario demo de Olimaps. Me encanta explorar la ciudad y conocer gente nueva.',
  followers: 142,
  following: 89,
  isFollowing: false,
  notifications: [
    {
      id: 1,
      type: 'like',
      title: 'Nuevo me gusta',
      text: 'A alguien le gustó tu post',
      image: 'https://picsum.photos/50/50?random=2',
      read: false,
      created_at: Date.now() - 3600000
    },
    {
      id: 2,
      type: 'follow',
      title: 'Nuevo seguidor',
      text: 'Tienes un nuevo seguidor',
      image: 'https://picsum.photos/50/50?random=3',
      read: false,
      created_at: Date.now() - 7200000
    }
  ],
  participation: [
    {
      event: {
        event_id: 'event-1',
        title: 'Quedada en el parque',
        emoji: '🌳',
        start_date: new Date(Date.now() + 86400000).toISOString(),
        end_date: new Date(Date.now() + 86400000 + 3600000).toISOString()
      },
      confirmed: true
    },
    {
      event: {
        event_id: 'event-2', 
        title: 'Concierto en la plaza',
        emoji: '🎵',
        start_date: new Date(Date.now() + 172800000).toISOString(),
        end_date: new Date(Date.now() + 172800000 + 7200000).toISOString()
      },
      confirmed: true
    }
  ],
  rrss: [
    { type: 'instagram', name: 'demo_user_ig' },
    { type: 'twitter', name: 'demo_user_tw' }
  ],
  groups: [
    {
      chat: {
        chat_id: 'group-1',
        title: 'Grupo Demo',
        cover: 'https://picsum.photos/100/100?random=4'
      }
    }
  ],
  post: [],
  event: []
}

export const state = () => ({
  user: demoUser,
  portals: [
    defaultPortal,
    {
      audience: 75,
      coordinates: { lat: 40.4168, lng: -3.7038 },
      created_at: Date.now() - 1800000,
      event: null,
      is_liked: false,
      is_saved: false,
      likes: 23,
      opened: 180,
      permanent: false,
      post_id: 'portal-1',
      profile_id: 'user-portal-1',
      profile_picture: "https://picsum.photos/200/200?random=100",
      score: null,
      shared: 8,
      src: "https://picsum.photos/400/600?random=200",
      text: "¡Increíble atardecer desde el Templo de Debod!",
      type: "image",
      info: false,
      url: null,
      username: "madrid_sunset"
    },
    {
      audience: 45,
      coordinates: { lat: 40.4200, lng: -3.7100 },
      created_at: Date.now() - 3600000,
      event: null,
      is_liked: true,
      is_saved: false,
      likes: 12,
      opened: 95,
      permanent: false,
      post_id: 'portal-2',
      profile_id: 'user-portal-2',
      profile_picture: "https://picsum.photos/200/200?random=101",
      score: null,
      shared: 3,
      src: "",
      text: "Probando las nuevas funciones de Olimaps. ¡Me encanta esta app!",
      type: "short",
      info: false,
      url: null,
      username: "tech_early_adopter"
    },
    {
      audience: 65,
      coordinates: { lat: 40.4150, lng: -3.7080 },
      created_at: Date.now() - 5400000,
      event: null,
      is_liked: false,
      is_saved: true,
      likes: 18,
      opened: 140,
      permanent: false,
      post_id: 'portal-3',
      profile_id: 'user-portal-3',
      profile_picture: "https://picsum.photos/200/200?random=102",
      score: null,
      shared: 6,
      src: "https://picsum.photos/400/300?random=201",
      text: "Comida deliciosa en el Mercado de San Miguel",
      type: "image",
      info: false,
      url: null,
      username: "foodie_madrid"
    }
  ],
  newNotification: null,
  pushEnabled: false,
  pushAvailable: false,
  logChecked: true,
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
  async checkLogged({ state }) {
    // Always return true since we have a hardcoded user
    return true
  },
  initAuthError({ dispatch }, router) {
    // No auth errors in demo mode
  },
  logout({ commit }) {
    // In demo mode, just refresh the page to "logout"
    window.location.reload()
  },
  async login() {
    // Always succeed in demo mode
    return true
  },
  async sendConfirmationEmail() {
    // Demo mode - always succeed
    return true
  },
  async verifyUser() {
    // Demo mode - always succeed
    return true
  },
  async recoverPassword() {
    // Demo mode - always succeed
    return true
  },
  async loginPhone() {
    // Demo mode - always succeed
    return true
  },
  async signupByPhone() {
    // Demo mode - always succeed
    return true
  },
  async signupByEmail() {
    // Demo mode - always succeed
    return true
  },
  async signup() {
    // Demo mode - always succeed
    return true
  },
  async getPortals({ commit }) {
    // Return hardcoded portals
    const demoPortals = [
      {
        audience: 50,
        coordinates: { lat: 40.4168, lng: -3.7038 },
        created_at: Date.now() - 3600000,
        event: null,
        is_liked: false,
        is_saved: false,
        likes: 15,
        opened: 120,
        permanent: false,
        post_id: 'post-1',
        profile_id: 'user-2',
        profile_picture: "https://picsum.photos/200/200?random=10",
        score: null,
        shared: 5,
        src: "https://picsum.photos/400/600?random=20",
        text: "¡Qué día tan bonito en Madrid!",
        type: "image",
        info: false,
        url: null,
        username: "madrid_lover"
      },
      {
        audience: 35,
        coordinates: { lat: 40.4200, lng: -3.7100 },
        created_at: Date.now() - 7200000,
        event: null,
        is_liked: true,
        is_saved: false,
        likes: 8,
        opened: 85,
        permanent: false,
        post_id: 'post-2',
        profile_id: 'user-3',
        profile_picture: "https://picsum.photos/200/200?random=11",
        score: null,
        shared: 2,
        src: "",
        text: "Probando la nueva funcionalidad de Olimaps",
        type: "short",
        info: false,
        url: null,
        username: "tech_explorer"
      },
      {
        audience: 80,
        coordinates: { lat: 40.4190, lng: -3.7060 },
        created_at: Date.now() - 10800000,
        event: null,
        is_liked: false,
        is_saved: true,
        likes: 32,
        opened: 200,
        permanent: false,
        post_id: 'post-3',
        profile_id: 'user-4',
        profile_picture: "https://picsum.photos/200/200?random=12",
        score: null,
        shared: 12,
        src: "https://picsum.photos/400/600?random=21",
        text: "Arte urbano increíble en Malasaña",
        type: "image",
        info: false,
        url: null,
        username: "street_art_fan"
      }
    ]
    commit('setPortals', demoPortals)
    return true
  },
  async updatePassword() {
    // Demo mode - always succeed
    return true
  },
  async getMe({ state, commit, dispatch }) {
    // User is already set in state, just trigger related actions
    dispatch('chat/getChats', {}, { root: true })
    return true
  },
}
