const fs = require('fs')
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Olimaps',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
      },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css',
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/vue-mapbox@latest/dist/vue-mapbox.css',
      },
    ],
    script: [
      {
        src: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.js',
      },
      {
        src:
          'https://cdn.jsdelivr.net/npm/vue-mapbox@latest/dist/vue-mapbox.min.js',
        type: 'text/javascript',
      },
    ],
  },
  env: {
    SERVER_URL: process.env.SERVER_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    ELASTIC_URL: process.env.ELASTIC_URL,
    ELASTICSEARCH: process.env.ELASTICSEARCH,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },

  vue: {
    config: {
      productionTip: false,
    },
  },

  server: {
    host: '0.0.0.0',
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
    // '@nuxtjs/onesignal', // BEFORE pwa
  ],

  oneSignal: {
    init: {
      appId: 'YOUR_APP_ID',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true,
      },
    },
  },

  plugins: [
    { src: '~/plugins/masonry.js', ssr: false },
    { src: '~/plugins/viewer.js' },
    { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/mask.js' },
  ],

  vuetify: {
    defaultAssets: {
      icons: 'fa',
    },
    theme: {
      themes: {
        light: {
          primary: '#F0134D',
          secondary: '#FFC764',
          red: '#F0134D',
          orange: '#FF884B',
          yellow: '#FFC764',
          background: '#FAFAFA',
          white: '#F5F0E3',
          black: '#3E3E3E',
          text: '#025275',
        },
        dark: {
          primary: '#F0134D',
          secondary: '#FFC764',
          red: '#F0134D',
          orange: '#FF884B',
          yellow: '#FFC764',
          background: '#3E3E3E',
          white: '#F5F0E3',
          black: '#3E3E3E',
          text: '#F5F0E3',
        },
      },
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/firebase',
  ],

  firebase: {
    config: {
      apiKey: 'AIzaSyBxGHKm38LWJkSQa5l2b17JfyEh-Uu6ztA',
      authDomain: 'olimaps-firebase.firebaseapp.com',
      projectId: 'olimaps-firebase',
      storageBucket: 'olimaps-firebase.appspot.com',
      messagingSenderId: '581147596652',
      appId: '1:581147596652:web:721cf9ef21c90aa5d2c549',
      measurementId: 'G-N24W84QP8E'
    },
    services: {
      messaging: {
        createServiceWorker: true,
        fcmPublicVapidKey: 'BA84ymQLz9C8zPCw0AeQh5ofs-KKfBK6BTfoex9d3fPq9PjDg99WIzDSfiErdQqOal8tpALRsg52HGyQM2Ic44o',
        inject: fs.readFileSync('./serviceWorker.js')
      },
      auth: {
        persistence: 'local', // default
        ssr: false, // default
        emulatorPort: undefined,
        emulatorHost: 'http://localhost',
      },
      analytics: {
        collectionEnabled: true // default
      }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // storybook: {
  //   // Options
  //   decorators: [
  //     // VApp decorator for Vuetify
  //     `<v-app id='vuetify-storybook-decorator'><div><story/></div></v-app>`,
  //   ],
  // },

  // ∂ module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    workbox: {
      importScripts: ['firebase-messaging-sw.js']
    },
    meta: {

      title: "Qué está pasando a tu alrededor 🌍 | Olimaps",
      meta: [
        {
          name: "description",
          content:
            "Descubre que está haciendo la gente cerca de ti y conocelos haciendo eventos."
        },
        {
          property: "og:title",
          content: "Qué está pasando a tu alrededor 🌍 | Olimaps"
        },
        {
          property: "og:description",
          content:
            "Descubre que está haciendo la gente cerca de ti y conocelos haciendo eventos."
        },
        { property: "og:site_name", content: "Olimaps" },
        { property: "og:type", content: "website" },
        {
          property: "og:image",
          content: "https://olimaps.com/icon.png"
        },
        { property: "og:url", content: "https://olimaps.com" },
        {
          name: "twitter:title",
          content: "Qué está pasando a tu alrededor 🌍 | Olimaps"
        },
        {
          name: "twitter:description",
          content:
            "Descubre que está haciendo la gente cerca de ti y conocelos haciendo eventos."
        },
        {
          name: "twitter:image",
          content: "https://olimaps.com/icon.png"
        },
        { name: "twitter:image:alt", content: "Logo de Pick a Look" },
        {
          name: "twitter:card",
          content: "https://olimaps.com/icon.png"
        },
        { name: "twitter:site", content: "@versymattic" }
      ],
    },
    manifest: {
      name: 'Olimaps',
      short_name: 'Olimaps',
      description: 'Conoce e interactua con la gente de alrededor',
      start_url: 'https://olimaps.com',
      'background-color': '#F0134D',
      'theme-color': '#F0134D',
      display: 'standalone',
      orientation: "portrait",
      lang: 'es',
      useWebmanifestExtension: false,
    },
  },

  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    },
  },
}
