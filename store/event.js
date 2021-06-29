import axios from 'axios'

export const state = () => ({
  events: [],
  colors: {
    '🌍': 'blue-gray',
    '👜': 'blue-gray',
    '🛍': 'blue-gray',
    '🎨': 'brown',
    '🎥': 'brown',
    '📖': 'brown',
    '🖼': 'brown',
    '📷': 'yellow',
    '💻': 'yellow',
    '🎭': 'yellow',
    '🎮': 'yellow',
    '💪🏼': 'yellow',
    '🍻': 'purple',
    '☕️': 'purple',
    '🐶': 'purple',
    '💬': 'purple',
    '🥪': 'purple',
    '🍷': 'purple',
  },
  categories: [
    {
      emoji: '🌍',
      name: 'Explorar la zona',
      category: 'city',
    },
    {
      emoji: '👜',
      name: 'Fashion',
      category: 'city',
    },
    {
      emoji: '🛍',
      name: 'Shopping',
      category: 'city',
    },
    {
      emoji: '🎨',
      name: 'Arte',
      category: 'culture',
    },
    {
      emoji: '🎥',
      name: 'Cine',
      category: 'culture',
    },
    {
      emoji: '📖',
      name: 'Literatura',
      category: 'culture',
    },
    {
      emoji: '🖼',
      name: 'Museos y Galerias',
      category: 'culture',
    },
    {
      emoji: '📷',
      name: 'Fotografía',
      category: 'leisure',
    },
    {
      emoji: '💻',
      name: 'Tecnología',
      category: 'leisure',
    },
    {
      emoji: '🎭',
      name: 'Teatro',
      category: 'leisure',
    },
    {
      emoji: '🎮',
      name: 'Videojuegos',
      category: 'leisure',
    },
    {
      emoji: '💪🏼',
      name: 'Taller',
      category: 'leisure',
    },
    {
      emoji: '🍻',
      name: 'Cervezas',
      category: 'social',
    },
    {
      emoji: '☕️',
      name: 'Café',
      category: 'social',
    },
    {
      emoji: '🐶',
      name: 'Animales',
      category: 'social',
    },
    {
      emoji: '💬',
      name: 'Intercambio de Idiomas',
      category: 'social',
    },
    {
      emoji: '🥪',
      name: 'Merienda',
      category: 'social',
    },
    {
      emoji: '🍷',
      name: 'Vino y Cócteles',
      category: 'social',
    },

    // party: {
    //   name: 'Fiesta',
    //   color: 'deep-purple',
    //   icon: 'fas fa-glass-cheers',
    //   key: 'party',
    // },
    // sport: {
    //   name: 'Deportes',
    //   color: 'light-green darken-3',
    //   icon: 'fas fa-futbol',
    //   key: 'sport',
    // },
    // dance: {
    //   name: 'Bailar',
    //   color: 'indigo darken-3',
    //   icon: 'fas fa-compact-disc',
    //   key: 'dance',
    // },
    // astronomy: {
    //   name: 'Astronomía',
    //   color: 'blue-grey',
    //   icon: 'fas fa-moon',
    //   key: 'astronomy',
    // },
    // asociation: {
    //   name: 'Asociaciones',
    //   color: 'amber darken-3',
    //   icon: 'fas fa-universal-access',
    //   key: 'asociation',
    // },
    // movie: {
    //   name: 'Película',
    //   color: 'grey darken-3',
    //   icon: 'fas fa-film',
    //   key: 'movie',
    // },
    // gastronomy: {
    //   name: 'Gastronomía',
    //   color: 'red darken-3',
    //   icon: 'fas fa-apple-alt',
    //   key: 'gastronomy',
    // },
    // culture: {
    //   name: 'Cultura',
    //   color: 'brown',
    //   icon: 'fas fa-landmark',
    //   key: 'culture',
    // },
    // painting: {
    //   name: 'Dibujo',
    //   color: 'amber darken-3',
    //   icon: 'fas fa-palette',
    //   key: 'painting',
    // },
    // erasmus: {
    //   name: 'Erasmus',
    //   color: 'deep-purple',
    //   icon: 'fas fa-globe-europe',
    //   key: 'erasmus',
    // },
    // fotography: {
    //   name: 'Fotografía',
    //   color: 'cyan darken-3',
    //   icon: 'fas fa-camera-retro',
    //   key: 'fotography',
    // },
    // history: {
    //   name: 'Historia',
    //   color: 'brown',
    //   icon: 'fas fa-book',
    //   key: 'history',
    // },
    // language: {
    //   name: 'Idiomas',
    //   color: 'indigo darken-3',
    //   icon: 'fas fa-language',
    //   key: 'language',
    // },
    // boardgame: {
    //   name: 'Juegos Mesa',
    //   color: 'deep-orange',
    //   icon: 'fas fa-chess-knight',
    //   key: 'boardgame',
    // },
    // reading: {
    //   name: 'Lectura',
    //   color: 'deep-purple',
    //   icon: 'fas fa-book-reader',
    //   key: 'reading',
    // },
    // pets: {
    //   name: 'Mascotas',
    //   color: 'brown',
    //   icon: 'fas fa-paw',
    //   key: 'pets',
    // },
    // enviroment: {
    //   name: 'Medio Ambiente',
    //   color: 'green darken-3',
    //   icon: 'fas fa-leaf',
    //   key: 'enviroment',
    // },
    // fashion: {
    //   name: 'Moda',
    //   color: 'black',
    //   icon: 'fas fa-tshirt',
    //   key: 'fashion',
    // },
    // motor: {
    //   name: 'Motor',
    //   color: 'red darken-3',
    //   icon: 'fas fa-car',
    //   key: 'motor',
    // },
    // bike: {
    //   name: 'Ciclismo',
    //   color: 'deep-purple',
    //   icon: 'fas fa-bicycle',
    //   key: 'bike',
    // },
    // tourism: {
    //   name: 'Turísmo',
    //   color: 'yellow darken-3',
    //   icon: 'fas fa-umbrella',
    //   key: 'tourism',
    // },
    // music: {
    //   name: 'Música',
    //   color: 'deep-purple',
    //   icon: 'fas fa-music',
    //   key: 'music',
    // },
    // walk: {
    //   name: 'Paseo',
    //   color: 'lime darken-3',
    //   icon: 'fas fa-shoe-prints',
    //   key: 'walk',
    // },
    // fishing: {
    //   name: 'Pesca',
    //   color: 'blue darken-3',
    //   icon: 'fas fa-fish',
    //   key: 'fishing',
    // },
    // talk: {
    //   name: 'Charla',
    //   color: 'teal darken-3',
    //   icon: 'fas fa-comments',
    //   key: 'talk',
    // },
    // travel: {
    //   name: 'Viajes',
    //   color: 'deep-purple',
    //   icon: 'fas fa-plane',
    //   key: 'travel',
    // },
    // videogames: {
    //   name: 'Videojuegos',
    //   color: 'purple darken-3',
    //   icon: 'fas fa-gamepad',
    //   key: 'videogames',
    // },
    // theatre: {
    //   name: 'Teatro',
    //   color: 'deep-orange darken-2',
    //   icon: 'fas fa-theater-masks',
    //   key: 'theatre',
    // },
  ],
})

export const mutations = {
  setEvents(state, events) {
    state.events = events
  },
}

export const actions = {
  async getEvents({ commit, rootState }) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/events?lat=${rootState.map.userPosition.lat}&lng=${rootState.map.userPosition.lng}`
      )
      console.log('EVENTS', data)
      commit('setEvents', data)
    } catch (err) {
      console.error(err)
    }
  },
  async getEvent(_, eventId) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/events/${eventId}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async createEvent(_, event) {
    try {
      const { data } = await axios.post(
        `${process.env.SERVER_URL}/events`,
        event
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async joinEvent(_, eventId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/events/join/${eventId}`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async unjoinEvent(_, eventId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/events/unjoin/${eventId}`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getNearbyEvents(_, coordinates) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/events/nearby?lat=${coordinates.lat}&lng=${coordinates.lng}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
}
