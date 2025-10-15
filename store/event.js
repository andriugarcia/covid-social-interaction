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
      name: 'Explore the area',
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
      name: 'Art',
      category: 'culture',
    },
    {
      emoji: '🎥',
      name: 'Cinema',
      category: 'culture',
    },
    {
      emoji: '📖',
      name: 'Literature',
      category: 'culture',
    },
    {
      emoji: '🖼',
      name: 'Museums and Galleries',
      category: 'culture',
    },
    {
      emoji: '📷',
      name: 'Photography',
      category: 'leisure',
    },
    {
      emoji: '🌙',
      name: 'Astronomy',
      category: 'leisure',
    },
    {
      emoji: '💻',
      name: 'Technology',
      category: 'leisure',
    },
    {
      emoji: '🎭',
      name: 'Theatre',
      category: 'leisure',
    },
    {
      emoji: '📖',
      name: 'Reading',
      category: 'leisure',
    },
    {
      emoji: '🎮',
      name: 'Video Games',
      category: 'leisure',
    },
    {
      emoji: '🃏',
      name: 'Board Games',
      category: 'leisure',
    },
    {
      emoji: '🍻',
      name: 'Beers',
      category: 'food',
    },
    {
      emoji: '☕️',
      name: 'Coffee',
      category: 'food',
    },
    {
      emoji: '🍳',
      name: 'Cooking',
      category: 'food',
    },
    {
      emoji: '👨‍🍳',
      name: 'Gastronomy',
      category: 'food',
    },
    {
      emoji: '🧺',
      name: 'Picnic',
      category: 'food',
    },
    {
      emoji: '🥐',
      name: 'Breakfast',
      category: 'food',
    },
    {
      emoji: '🥪',
      name: 'Snack',
      category: 'food',
    },
    {
      emoji: '🍽',
      name: 'Dinner',
      category: 'food',
    },
    {
      emoji: '💪🏼',
      name: 'Workshop',
      category: 'leisure',
    },
    {
      emoji: '⛺️',
      name: 'Camping',
      category: 'outdoor',
    },
    {
      emoji: '🏔',
      name: 'Hiking',
      category: 'outdoor',
    },
    {
      emoji: '🏃‍♂️',
      name: 'Running',
      category: 'outdoor',
    },
    {
      emoji: '🍸',
      name: 'Party',
      category: 'social',
    },
    {
      emoji: '🎤',
      name: 'Concert',
      category: 'social',
    },
    {
      emoji: '🕺',
      name: 'Nightclub',
      category: 'social',
    },
    {
      emoji: '💃',
      name: 'Dance',
      category: 'social',
    },
    {
      emoji: '🐶',
      name: 'Animals',
      category: 'social',
    },
    {
      emoji: '🗣',
      name: 'Chat',
      category: 'social',
    },
    {
      emoji: '💬',
      name: 'Language Exchange',
      category: 'social',
    },
    {
      emoji: '🇪🇺',
      name: 'Erasmus',
      category: 'social',
    },
    {
      emoji: '🍷',
      name: 'Wine and Cocktails',
      category: 'social',
    },
    {
      emoji: '⚽️',
      name: 'Soccer',
      category: 'sports',
    }, {
      emoji: '🏀',
      name: 'Basketball',
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
      name: 'Tennis',
      category: 'sports',
    }, {
      emoji: '🏐',
      name: 'Volleyball',
      category: 'sports',
    }, {
      emoji: '🎱',
      name: 'Billiards',
      category: 'sports',
    }, {
      emoji: '🏓',
      name: 'Table Tennis',
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
      name: 'Boxing',
      category: 'sports',
    }, {
      emoji: '🛹',
      name: 'Skate',
      category: 'sports',
    }, {
      emoji: '🛼',
      name: 'Skating',
      category: 'sports',
    }, {
      emoji: '⛸',
      name: 'Ice Skating',
      category: 'sports',
    }, {
      emoji: '⛷',
      name: 'Skiing',
      category: 'sports',
    }, {
      emoji: '🏊',
      name: 'Swimming',
      category: 'sports',
    }, {
      emoji: '🧘‍♀️',
      name: 'Yoga',
      category: 'sports',
    }, {
      emoji: '🤽‍♀️',
      name: 'Water Polo',
      category: 'sports',
    }, {
      emoji: '🧗‍♀️',
      name: 'Climbing',
      category: 'sports',
    }, {
      emoji: '🚴',
      name: 'Cycling',
      category: 'sports',
    }, {
      emoji: '🐎',
      name: 'Equestrian',
      category: 'sports',
    }, {
      emoji: '🎯',
      name: 'Darts',
      category: 'sports',
    }, {
      emoji: '🎳',
      name: 'Bowling',
      category: 'sports',
    }, {
      emoji: '♟',
      name: 'Chess',
      category: 'sports',
    }, {
      emoji: '🎲',
      name: 'Other Games',
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
    // Demo mode - simulate sharing
    commit('setShareCreated', true, { root: true })
    return true
  },
  async getEvents({ commit, rootState }, page = 0) {
    // Return demo events
    const demoEvents = [
      {
        event_id: 'demo-event-1',
        title: 'Meetup at Retiro',
        category: '🌳',
        description: 'Let\'s spend a relaxing afternoon at Retiro Park. Perfect for meeting new people and enjoying good weather.',
        start_date: Date.now() + 86400000, // Tomorrow
        end_date: Date.now() + 90000000, // Tomorrow + 1 hour
        coordinates: { lat: 40.4152, lng: -3.6844 },
        username: 'park_lover',
        profile_picture: 'https://picsum.photos/50/50?random=200',
        profile_id: 'user-park-lover',
        participants: 8,
        max_participants: 15,
        is_joined: false,
        follow: false
      },
      {
        event_id: 'demo-event-2',
        title: 'Concert in Malasaña',
        category: '🎵',
        description: 'Indie music concert in a cozy venue in Malasaña. Don\'t miss it!',
        start_date: Date.now() + 172800000, // Day after tomorrow
        end_date: Date.now() + 183600000, // Day after tomorrow + 3 hours
        coordinates: { lat: 40.4262, lng: -3.7006 },
        username: 'music_lover',
        profile_picture: 'https://picsum.photos/50/50?random=201',
        profile_id: 'user-music-lover',
        participants: 22,
        max_participants: 30,
        is_joined: true,
        follow: true
      },
      {
        event_id: 'demo-event-3',
        title: 'Language Exchange',
        category: '💬',
        description: 'Practice Spanish, English and other languages in a relaxed environment. All levels welcome.',
        start_date: Date.now() + 259200000, // In 3 days
        end_date: Date.now() + 266400000, // In 3 days + 2 hours
        coordinates: { lat: 40.4200, lng: -3.7038 },
        username: 'polyglot_madrid',
        profile_picture: 'https://picsum.photos/50/50?random=202',
        profile_id: 'user-polyglot',
        participants: 12,
        max_participants: 20,
        is_joined: false,
        follow: false
      }
    ]
    
    commit('setEvents', demoEvents)
  },
  async getEvent(_, eventId) {
    // Return demo event data
    return {
      event_id: eventId,
      title: 'Demo Event',
      category: '🎉',
      description: 'A demo event to showcase functionality',
      start_date: Date.now() + 86400000,
      end_date: Date.now() + 90000000,
      coordinates: { lat: 40.4168, lng: -3.7038 },
      username: 'demo_organizer',
      profile_picture: 'https://picsum.photos/50/50?random=210',
      profile_id: 'user-demo-organizer',
      participants: 5,
      max_participants: 10,
      is_joined: false,
      follow: false,
      address: 'Madrid, Spain'
    }
  },
  async createEvent(_, event) {
    // Demo mode - simulate event creation
    const newEventId = 'new-event-' + Date.now()
    return newEventId
  },
  async joinEvent(_, eventId) {
    // Demo mode - always succeed
    return true
  },
  async unjoinEvent(_, eventId) {
    // Demo mode - always succeed
    return true
  },
  async cancelEvent(_, eventId) {
    // Demo mode - always succeed
    return true
  },
  async getNearbyEvents(_, { coordinates, page }) {
    // Return demo nearby events
    const demoNearbyEvents = [
      {
        event_id: 'nearby-event-1',
        title: 'Event near you',
        category: '🍻',
        description: 'Event near your location',
        start_date: Date.now() + 86400000,
        end_date: Date.now() + 90000000,
        coordinates: { lat: coordinates.lat + 0.001, lng: coordinates.lng + 0.001 },
        username: 'local_organizer',
        profile_picture: 'https://picsum.photos/50/50?random=220',
        participants: 3,
        max_participants: 8,
        distance: '0.1 km'
      },
      {
        event_id: 'nearby-event-2',
        title: 'Another local event',
        category: '☕️',
        description: 'Coffee and chat in the neighborhood',
        start_date: Date.now() + 172800000,
        end_date: Date.now() + 176400000,
        coordinates: { lat: coordinates.lat - 0.002, lng: coordinates.lng + 0.002 },
        username: 'coffee_enthusiast',
        profile_picture: 'https://picsum.photos/50/50?random=221',
        participants: 6,
        max_participants: 12,
        distance: '0.3 km'
      }
    ]
    
    return demoNearbyEvents
  },
}
