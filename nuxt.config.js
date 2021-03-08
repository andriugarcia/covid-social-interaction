export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'olimaps',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
    SOCKET_URL: process.env.SOCKET_URL,
    ELASTIC_URL: process.env.ELASTIC_URL,
    ELASTICSEARCH: process.env.ELASTICSEARCH,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },

  // server: {
  //   host: '0.0.0.0',
  // },

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],

  // plugins: ['~/plugins/fontawesome.js'],

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
    'vue-web-cam/nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // storybook: {
  //   // Options
  //   decorators: [
  //     // VApp decorator for Vuetify
  //     `<v-app id='vuetify-storybook-decorator'><div><story/></div></v-app>`,
  //   ],
  // },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
