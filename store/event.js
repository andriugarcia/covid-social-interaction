import axios from '../axios'

export const state = () => ({
  events: [],
  colors: {
    '🌍': 'red',
    '👜': 'red',
    '🛍': 'red',
    '🎨': 'brown',
    '🎥': 'brown',
    '📖': 'brown',
    '🖼': 'brown',
    '📷': 'yellow',
    '🌙': 'yellow',
    '💻': 'yellow',
    '🎭': 'yellow',
    '📖': 'yellow',
    '🎮': 'yellow',
    '💪🏼': 'yellow',
    '🍻': 'orange',
    '☕️': 'orange',
    '🥪': 'orange',
    '🍳': 'orange',
    '👨‍🍳': 'orange',
    '🧺': 'orange',
    '🥐': 'orange',
    '🍽': 'orange',
    '🍸': 'purple',
    '🎤': 'purple',
    '🕺': 'purple',
    '🐶': 'purple',
    '🗣': 'purple',
    '💬': 'purple',
    '🇪🇺': 'purple',
    '🍷': 'purple',
    '⛺️': 'blue',
    '🏔': 'blue',
    '🏃‍♂️': 'blue',
    '⚽️': 'green',
    '🏀': 'green',
    '🏈': 'green',
    '⚾️': 'green',
    '🎾': 'green',
    '🏐': 'green',
    '🎱': 'green',
    '🏓': 'green',
    '🪖': 'green',
    '🏸': 'green',
    '🏒': 'green',
    '🥊': 'green',
    '🛹': 'green',
    '🛼': 'green',
    '⛸': 'green',
    '⛷': 'green',
    '🏊': 'green',
    '🧘‍♀️': 'green',
    '🤽‍♀️': 'green',
    '🧗‍♀️': 'green',
    '🚴': 'green',
    '🐎': 'green',
    '🎯': 'green',
    '🎳': 'green',
    '♟': 'green',
    '🎲': 'green',
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
      emoji: '🌙',
      name: 'Astronomía',
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
      emoji: '📖',
      name: 'Lectura',
      category: 'leisure',
    },
    {
      emoji: '🎮',
      name: 'Videojuegos',
      category: 'leisure',
    },
    {
      emoji: '🃏',
      name: 'Juegos de Mesa',
      category: 'leisure',
    },
    {
      emoji: '🍻',
      name: 'Cervezas',
      category: 'food',
    },
    {
      emoji: '☕️',
      name: 'Café',
      category: 'food',
    },
    {
      emoji: '🍳',
      name: 'Cocina',
      category: 'food',
    },
    {
      emoji: '👨‍🍳',
      name: 'Gastronomía',
      category: 'food',
    },
    {
      emoji: '🧺',
      name: 'Picnic',
      category: 'food',
    },
    {
      emoji: '🥐',
      name: 'Desayuno',
      category: 'food',
    },
    {
      emoji: '🥪',
      name: 'Merienda',
      category: 'food',
    },
    {
      emoji: '🍽',
      name: 'Cena',
      category: 'food',
    },
    {
      emoji: '💪🏼',
      name: 'Taller',
      category: 'leisure',
    },
    {
      emoji: '⛺️',
      name: 'Camping',
      category: 'outdoor',
    },
    {
      emoji: '🏔',
      name: 'Senderismo',
      category: 'outdoor',
    },
    {
      emoji: '🏃‍♂️',
      name: 'Running',
      category: 'outdoor',
    },
    {
      emoji: '🍸',
      name: 'Fiesta',
      category: 'social',
    },
    {
      emoji: '🎤',
      name: 'Concierto',
      category: 'social',
    },
    {
      emoji: '🕺',
      name: 'Discoteca',
      category: 'social',
    },
    {
      emoji: '💃',
      name: 'Baile',
      category: 'social',
    },
    {
      emoji: '🐶',
      name: 'Animales',
      category: 'social',
    },
    {
      emoji: '🗣',
      name: 'Charlar',
      category: 'social',
    },
    {
      emoji: '💬',
      name: 'Intercambio de Idiomas',
      category: 'social',
    },
    {
      emoji: '🇪🇺',
      name: 'Erasmus',
      category: 'social',
    },
    {
      emoji: '🍷',
      name: 'Vino y Cócteles',
      category: 'social',
    },
    {
      emoji: '⚽️',
      name: 'Fútbol',
      category: 'sports',
    }, {
      emoji: '🏀',
      name: 'Baloncesto',
      category: 'sports',
    }, {
      emoji: '🏈',
      name: 'Rugby',
      category: 'sports',
    }, {
      emoji: '⚾️',
      name: 'Baseball',
      category: 'sports',
    }, {
      emoji: '🎾',
      name: 'Tenis',
      category: 'sports',
    }, {
      emoji: '🏐',
      name: 'Volleyball',
      category: 'sports',
    }, {
      emoji: '🎱',
      name: 'Billar',
      category: 'sports',
    }, {
      emoji: '🏓',
      name: 'Tenis de Mesa',
      category: 'sports',
    }, {
      emoji: '🪖',
      name: 'Airsoft',
      category: 'sports',
    }, {
      emoji: '🏸',
      name: 'Badminton',
      category: 'sports',
    }, {
      emoji: '🏒',
      name: 'Hockey',
      category: 'sports',
    }, {
      emoji: '🥊',
      name: 'Boxeo',
      category: 'sports',
    }, {
      emoji: '🛹',
      name: 'Skate',
      category: 'sports',
    }, {
      emoji: '🛼',
      name: 'Patinaje',
      category: 'sports',
    }, {
      emoji: '⛸',
      name: 'Patinaje sobre Hielo',
      category: 'sports',
    }, {
      emoji: '⛷',
      name: 'Esquí',
      category: 'sports',
    }, {
      emoji: '🏊',
      name: 'Natación',
      category: 'sports',
    }, {
      emoji: '🧘‍♀️',
      name: 'Yoga',
      category: 'sports',
    }, {
      emoji: '🤽‍♀️',
      name: 'Waterpolo',
      category: 'sports',
    }, {
      emoji: '🧗‍♀️',
      name: 'Escalada',
      category: 'sports',
    }, {
      emoji: '🚴',
      name: 'Ciclismo',
      category: 'sports',
    }, {
      emoji: '🐎',
      name: 'Hípica',
      category: 'sports',
    }, {
      emoji: '🎯',
      name: 'Dardos',
      category: 'sports',
    }, {
      emoji: '🎳',
      name: 'Bolos',
      category: 'sports',
    }, {
      emoji: '♟',
      name: 'Ajedrez',
      category: 'sports',
    }, {
      emoji: '🎲',
      name: 'Otros juegos',
      category: 'sports',
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

export const getters = {
  currentEvent(_, __, rootState) {
    const now = new Date()
    return rootState.auth.user.participation.find(participation => {
      const start = new Date(participation.event.start_date)
      let end = new Date(participation.event.end_date)
      end.setDate(end.getDate() + 2);
      return (start <= now && end >= now)
    })
  }
}

export const actions = {
  async share({ commit }, event) {
    try {
      await axios.post(`${process.env.SERVER_URL}/events/share/${event.event}`, {
        targets: event.targets,
      })
      commit('setShareCreated', true, { root: true })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getEvents({ commit, rootState }, page = 0) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/events?lat=${rootState.map.userPosition.lat}&lng=${rootState.map.userPosition.lng}&page=${page}`
      )

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
      return null
    }
  },
  async createEvent(_, event) {
    try {
      const { data } = await axios.post(
        `${process.env.SERVER_URL}/events`,
        event
      )
      this.app.$fire.analytics.logEvent('add_event', {
        event_id: data,
      })
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async joinEvent(_, eventId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/events/join/${eventId}`)
      this.app.$fire.analytics.logEvent('join_event', {
        event_id: eventId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async unjoinEvent(_, eventId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/events/unjoin/${eventId}`)
      this.app.$fire.analytics.logEvent('unjoin_event', {
        event_id: eventId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async cancelEvent(_, eventId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/events/cancel/${eventId}`)
      this.app.$fire.analytics.logEvent('cancel_event', {
        event_id: eventId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async getNearbyEvents(_, { coordinates, page }) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/events/nearby?lat=${coordinates.lat}&lng=${coordinates.lng}&page=${page}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
}
