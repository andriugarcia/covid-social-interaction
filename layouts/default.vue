<template lang="pug">
v-app
  #mobile(v-if='!$vuetify.breakpoint.mdAndUp', style='height: 100%')
    v-slide-y-transition
      v-card(
        v-if='newNotification',
        flat,
        color='primary',
        @click='openNotification',
        style='position: fixed; top: 0; left: 0; right: 0; z-index: 999999; border-radius: 0 0 24px 24px'
      )
        v-list-item.py-6.px-6(nuxt, dark)
          v-icon.mr-4 {{ getIcon(newNotification.type) }}
          v-avatar(size='40')
            v-img(:src='newNotification.image') 
          .ml-2.mt-2.font-weight-bold
            span {{ newNotification.title }}
            p {{ newNotification.text }}
        v-layout(justify-center)
          #holder.mb-2
    main-mobile(v-if='$route.name == "index"')
    nuxt(v-else, style='position: fixed; inset: 0')
  #desktop(v-else)
    mainDesktop
      nuxt
  v-bottom-sheet(
    v-model='bottomSheetOpened',
    :inset='$vuetify.breakpoint.mdAndUp'
  )
    login
  v-dialog(:value='newContactsDialog')
    new-contacts
  v-snackbar(
    v-model='postCreated',
    :timeout='1500',
    centered,
    bottom,
    color='primary',
    elevation='16'
  ) Publicado correctamente
  v-snackbar(
    v-model='shareCreated',
    :timeout='1500',
    centered,
    bottom,
    color='primary',
    elevation='16'
  ) Compartido correctamente
</template>

<script>
import iconNotificationMixin from '@/mixins/iconNotification'
import pushNotificationMixin from '@/mixins/push'
export default {
  mixins: [iconNotificationMixin, pushNotificationMixin],
  components: {
    login: () => import('../components/login/login.vue'),
    mainMobile: () => import('../layouts/mainMobile.vue'),
    mainDesktop: () => import('../layouts/mainDesktop.vue'),
    newContacts: () => import('../layouts/newContacts.vue'),
  },
  async middleware({ app, store }) {
    console.log('MIDDLEWARE')
    await store.dispatch('auth/checkLogged')
  },
  data: () => ({
    centre: [0, 0],
    firstMapPositionUpdated: false,
    newContactsDialog: false,
  }),
  computed: {
    loginOpened() {
      return this.$store.state.loginOpened
    },
    newNotification: {
      get() {
        return this.$store.state.auth.newNotification
      },
      set() {
        this.$store.commit('auth/closeNewNotification')
      },
    },
    bottomSheetOpened: {
      get() {
        return this.loginOpened
      },
      set() {
        this.$store.commit('disableAllWindows')
      },
    },
    postCreated: {
      get() {
        return this.$store.state.postCreated
      },
      set(value) {
        this.$store.commit('setPostCreated', value)
      },
    },
    shareCreated: {
      get() {
        return this.$store.state.shareCreated
      },
      set(value) {
        this.$store.commit('setShareCreated', value)
      },
    },
  },
  mounted() {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    this.$store.dispatch('auth/initAuthError', this.$router) // Si recibe un 405 cierra sesion

    this.registerMessagingSw()
    this.checkIfNotificationsEnabled()
    this.checkIfAppIsInstalled()
    this.loadNearbyMessages()

    this.enableLocation()

    this.checkNewContactsAvailable()
  },
  methods: {
    loadNearbyMessages() {
      this.$store.commit('chat/loadNearbyMessages')
    },
    async checkNewContactsAvailable() {
      if (this.$store.state.auth.user.twitter_id) {
        await this.$store.dispatch('user/getRrssContacts')
        if (this.$store.state.user.rrssContacts.length > 0) {
          this.newContactsDialog = true
        }
      }
    },
    enableLocation() {
      const self = this
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log('GET CURRENT POSITION')
          self.updatePosition(position)
          self.$store.dispatch('chat/joinNearby')
        },
        (error) => {
          console.error(error)
        },
        { timeout: 10000 }
      )
      navigator.geolocation.watchPosition(function (position) {
        console.log('POSITION UPDATED')
        self.updatePosition(position)
      })
    },
    registerMessagingSw() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('firebase-messaging-sw.js')
          .then((registration) => {
            console.log(
              'Registration successful, scope is:',
              registration.scope
            )
          })
          .catch(function (err) {
            console.log('Service worker registration failed, error:', err)
          })
      }

      this.$fire.messaging.onMessage((payload) => {
        console.info('Mensaje recibido', payload)
      })

      // console.log('onTokenRefresh')
      // this.$fire.messaging.onTokenRefresh(() => {
      //   console.error('Token requiere ser refrescado')
      // })
    },
    checkIfAppIsInstalled() {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()

        // Stash the event so it can be triggered later.
        this.$store.state.deferredPrompt = e
        this.$store.state.appNotInstalled = true
      })
      window.addEventListener('appinstalled', (evt) => {
        this.$store.state.appNotInstalled = false
      })
    },
    updatePosition(position) {
      console.log(
        '%cActualizando posicion',
        'background-color: red; color: white'
      )
      const coordinates = {
        lng: position.coords.longitude,
        lat: position.coords.latitude,
        direction: position.heading,
      }

      if (!this.firstMapPositionUpdated) {
        console.log('%cPrimera vez', 'background-color: orange; color: white')
        this.firstMapPositionUpdated = true
        this.$store.commit('map/setZoom', 14)
        this.$store.commit('map/setMapPosition', coordinates)
        this.$store.commit('map/jumpTo', coordinates)
      }
      this.$store.commit('map/setUserPosition', coordinates)
      this.$store.dispatch('chat/getCloseChats')
      this.$store.dispatch('event/getEvents')
    },
    openNotification() {
      this.$router.push({ path: this.newNotification.link })
      this.newNotification = null
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;1,500&family=Rubik:wght@300;400;500;700;800&display=swap');
$body-font-family: 'Rubik';

.v-application {
  font-family: $body-font-family, sans-serif !important;
}

html {
  font-family: $body-font-family, 'Source Sans Pro', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

#holder {
  height: 4px;
  width: 60px;
  background-color: white;
  border-radius: 4px;
}

@media (max-width: 1264px) {
  .logo-down .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl,
  .logo-down .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
    margin-bottom: 68px !important;
    margin-left: 14px !important;
    margin-right: 14px !important;
  }
  .logo-up .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl,
  .logo-up .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
    margin-bottom: 142px !important;
    margin-left: 14px !important;
    margin-right: 14px !important;
  }
}

.letter-spacing-none {
  letter-spacing: 0;
}

.pointer {
  cursor: pointer;
}

/* Works on Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #025275 transparent;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 4px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: #025275;
  border-radius: 20px;
  // border: 1px solid transparent;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.device-height {
  //height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
}
</style>
