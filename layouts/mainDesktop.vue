<template lang="pug">
#Home
  v-layout(style='height: 100vh; position: relative')
    v-sheet(color='text')
      v-layout(column, align-center)
        v-btn.mb-2.mt-5(icon, @click='$router.replace({ path: "/" })')
          v-avatar
            v-img(:src='require("../assets/olimaps-logo.png")')
        v-btn.my-2(fab, depressed, color='primary', @click='openEditor')
          v-icon fas fa-plus
        .pl-1
          v-card.py-1.my-2.text-center(
            flat,
            :dark='!$route.name.startsWith("events")',
            :color='$route.name.startsWith("events") ? "white" : "text"',
            @click='$router.push({ path: "/events" })',
            style='border-radius: 8px 0 0 8px; width: 100%'
          )
            v-icon.pa-1(style='display: block') fas fa-flag
            span.font-weight-bold(style='font-size: 0.7em') EVENTOS
          v-card.py-1.my-2.text-center(
            flat,
            :dark='$route.name != "activity"',
            :color='$route.name == "activity" ? "white" : "text"',
            @click='openActivity',
            style='border-radius: 8px 0 0 8px; width: 100%'
          )
            v-badge(
              overlap,
              color='primary',
              style='z-index: 2',
              :value='totalNotifications > 0',
              :content='formatNumber(totalNotifications)'
            )
              v-icon.pa-1(style='display: block') fas fa-bell
              span.font-weight-bold(style='font-size: 0.7em') ACTIVIDAD
          v-card.py-1.my-2.text-center(
            flat,
            :dark='!$route.name.startsWith("chat") && !$route.name.startsWith("group")',
            :color='$route.name.startsWith("chat") || $route.name.startsWith("group") ? "white" : "text"',
            @click='openChat',
            style='border-radius: 8px 0 0 8px; width: 100%'
          )
            v-badge(
              overlap,
              color='primary',
              style='z-index: 2',
              :value='authenticated && total',
              :content='formatNumber(total)'
            )
              v-icon.pa-1(style='display: block') fas fa-comment-dots
              span.font-weight-bold(style='font-size: 0.7em') CHAT
        v-btn.mb-2.rounded-xl(
          v-if='appNotInstalled',
          fab,
          depressed,
          color='primary',
          @click='downloadApp',
          style='position: absolute; bottom: 0'
        )
          v-icon fas fa-arrow-circle-down
    v-flex(v-if='$route.name != "index"', md5)
      v-sheet(style='height: 100%; width: 100%')
        slot(style='position: relative; width: 100%')
    Map(
      @click='morePosts',
      style='position: relative; width: 100%; height: 100%'
    )
  v-layout.pa-4(style='position: absolute; top: 0px; right: 0', align-center)
    //- img(src="@/assets/olimaps-logo.png", style="width: 36px; height: 36px;")
    //- img(src="@/assets/olimaps-logo-light.png", style="height: 30px")
    v-spacer
    search
    v-btn.mr-2(small, depressed, fab, @click='flyToMe')
      v-icon(small, color='grey darken-2') fas fa-crosshairs
    v-menu(v-if='authenticated', rounded, offset-y)
      template(v-slot:activator='{ on }')
        v-btn(fab, color='primary', v-on='on')
          v-avatar(color='white')
            v-img(:src='user.profile_picture')
      v-card
        v-list
          v-list-item(@click='$router.push({ path: "/" + user.username })') Mi perfil
          v-list-item(@click='$router.push({ path: "/saved" })') Post Guardados
          v-list-item(@click='logout') Cerrar Sesión
    v-btn(
      v-else,
      depressed,
      rounded,
      color='primary',
      @click='$router.push({ path: "/signup" })'
    )
      v-icon.mr-2(small) fas fa-user
      span.text-capitalize Crear Cuenta
  v-card.rounded-xl.pa-2(
    outlined,
    style='position: absolute; top: 96px; right: 18px; max-width: 380px; width: 100%'
  )
    portals
  viewer(v-model='opened')
    v-card
      search(
        v-if='opened == "search"',
        @back='opened = ""',
        @updated='updateCentre'
      )
  viewer(v-model='placeOpened')
    place-selected(@back='closePosts', :coordinates='coordinatesSelected')
</template>

<script>
import loginMixin from '@/mixins/login'
import numberMixin from '@/mixins/number'
import Map from '../components/map/map'
import Search from '../components/search/search'
import AvatarGroup from '../components/avatar-group'
import Postbar from '../components/home/postbar'
import Post from '../components/map/post'
import Portals from '../components/map/portals'

export default {
  components: {
    Map,
    Postbar,
    Search,
    AvatarGroup,
    Post,
    Portals,
    placeSelected: () => import('@/components/map/placeSelected'),
  },

  mixins: [loginMixin, numberMixin],

  beforeRouteUpdate(to, _, next) {
    if (Object.keys(to.query).length === 0) {
      this.opened = ''
    }
    next()
  },

  data() {
    return {
      opened: '',
      placeOpened: false,
      coordinatesSelected: null,
      fullPosts: [],
    }
  },

  computed: {
    total() {
      return this.$store.getters['chat/total']
    },
    totalNotifications() {
      return this.$store.getters['auth/totalNotifications']
    },
    user() {
      return this.$store.state.auth.user
    },
    authenticated() {
      return this.$store.getters['auth/authenticated']
    },
    appNotInstalled() {
      return this.$store.state.appNotInstalled
    },
  },
  methods: {
    downloadApp() {
      this.$store.commit('downloadApp')
    },
    logout() {
      this.$store.dispatch('auth/logout')
    },
    flyToMe() {
      if (!this.$store.state.map.locationEnabled) {
        const self = this
        navigator.geolocation.getCurrentPosition(
          function (position) {
            console.log('GET CURRENT POSITION')
            self.updatePosition(position)
          },
          (error) => {
            console.error(error)
          },
          { timeout: 10000 }
        )
      } else {
        this.$store.commit('map/flyToMe')
      }
    },
    updateCentre(coordinates) {
      this.$store.commit('map/setMapPosition', coordinates)
      this.$router.replace({ hash: '' })
      this.opened = ''
    },
    morePosts(coordinates) {
      this.coordinatesSelected = coordinates
      this.placeOpened = true
    },
    closePosts() {
      this.coordinatesSelected = null
      this.placeOpened = false
    },
    openSearch() {
      this.$router.replace({ hash: 'search' })
      this.opened = 'search'
    },
    openEditor() {
      if (this.openLoginIfNotAuthenticated()) return
      this.$router.push({ path: '/editor' })
    },
    openChat() {
      if (this.openLoginIfNotAuthenticated()) return
      this.$router.push({ path: '/chat' })
    },
    openActivity() {
      if (this.openLoginIfNotAuthenticated()) return
      this.$router.push({ path: '/activity' })
    },
  },
}
</script>
