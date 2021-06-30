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
    nuxt(v-else, style='height: 100%')
  #desktop(v-else)
    mainDesktop
      nuxt
  v-bottom-sheet(
    v-model='bottomSheetOpened',
    :inset='$vuetify.breakpoint.mdAndUp'
  )
    login
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
export default {
  mixins: [iconNotificationMixin],
  components: {
    login: () => import('../components/login/login.vue'),
    mainMobile: () => import('../layouts/mainMobile.vue'),
    mainDesktop: () => import('../layouts/mainDesktop.vue'),
  },
  async middleware({ store }) {
    await store.dispatch('auth/checkLogged')
  },
  data: () => ({
    centre: [0, 0],
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
    const self = this

    // this.initPushNotifications()

    this.$store.dispatch('auth/initAuthError', this.$router) // Si recibe un 405 cierra sesion

    this.checkIfAppIsInstalled()

    navigator.geolocation.getCurrentPosition(
      function (position) {
        self.updatePosition(position)
      },
      (error) => {
        console.error(error)
      },
      { timeout: 10000 }
    )
    navigator.geolocation.watchPosition(function (position) {
      self.updatePosition(position, true)
    })
  },
  methods: {
    async initPushNotifications() {
      console.log('INIT PUSH NOTIFICATIONS')
      const currentToken = await this.$fire.messaging.getToken()
      console.log(currentToken)

      this.$fire.messaging.onMessage((payload) => {
        console.info('Message received: ', payload)
      })
      this.$fire.messaging.onTokenRefresh(async () => {
        const refreshToken = await this.$fire.messaging.getToken()
        console.log('Token Refreshed', refreshToken)
      })
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
    updatePosition(position, onlyUser = false) {
      const coordinates = {
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      }

      // if (!onlyUser) {
      //   this.$store.commit('map/setMapPosition', coordinates)
      // }
      this.$store.commit('map/setUserPosition', coordinates)
      this.$store.dispatch('chat/joinNearby')
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
</style>
