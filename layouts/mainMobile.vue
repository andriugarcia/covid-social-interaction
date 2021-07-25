<template lang="pug">
#Home
  Map(
    @click='morePosts',
    style='position: absolute; top: 0; left: 0; right: 0; bottom: 0'
  )
  v-layout.pa-4(
    style='position: fixed; top: 0px; right: 0; left: 0',
    align-center,
    color='white'
  )
    img(
      src='@/assets/olimaps-logo.png',
      style='width: 36px; height: 36px',
      @click.prevent=''
    )
    img(
      src='@/assets/olimaps-logo-light.png',
      style='height: 30px',
      @click.prevent=''
    )
    v-spacer
    v-btn.mr-2(
      x-small,
      fab,
      color='white',
      @click.prevent='flyToMe',
      style='border: 1px solid black'
    )
      v-icon(x-small, color='grey darken-2') fas fa-crosshairs
    v-menu(v-if='authenticated', rounded, offset-y)
      template(v-slot:activator='{ on }')
        v-btn(fab, color='primary', v-on='on')
          v-avatar(color='white')
            v-img(:src='user.profile_picture')
      v-card(outlined)
        v-list
          v-list-item(
            @click.prevent='$router.push({ path: "/" + user.username })'
          ) Mi perfil
          v-list-item(@click.prevent='$router.push({ path: "/saved" })') Post Guardados
          v-list-item(@click.prevent='logout') Cerrar Sesión
    v-btn(
      v-else,
      depressed,
      rounded,
      color='primary',
      @click.prevent='$store.commit("setLogin", true)'
    )
      v-icon.mr-2(small) fas fa-user
      span.text-capitalize Crear Cuenta

  div(style='position: fixed; bottom: 12px; left: 0; right: 0')
    portals.pl-2
    v-card.mx-2.mb-2.rounded-xl(outlined, tile)
      v-layout(justify-space-around, align-center, @click.prevent='')
        v-flex.mx-2.rounded-lg.text-center(
          depressed,
          @click='$router.push({ path: "/events" })',
          color='#ffffff',
          hover,
          xs2
        )
          div
            v-icon.pa-1(color='black', style='display: block') fas fa-flag
            span(style='font-size: 0.7em') EVENTOS
        v-flex.mx-2.rounded-lg.text-center(
          depressed,
          @click='openSearch',
          color='#ffffff',
          hover,
          xs2
        )
          div
            v-icon.pa-1(color='black', style='display: block') fas fa-search
            span(style='font-size: 0.7em') BUSCAR
        v-btn(fab, depressed, color='primary', @click='openEditor')
          v-icon.white--text fas fa-plus
        v-flex.mx-2.rounded-lg.text-center(
          depressed,
          @click='openActivity',
          color='#ffffff',
          hover,
          xs2
        )
          v-badge(
            overlap,
            color='primary',
            :value='totalNotifications > 0',
            :content='formatNumber(totalNotifications)'
          )
            v-icon.pa-1(color='black', style='display: block') fas fa-bell
            span(style='font-size: 0.7em') ACTIVIDAD
        v-flex.mx-2.rounded-lg.text-center(
          depressed,
          @click='openChat',
          color='#ffffff',
          hover,
          xs2
        )
          v-badge(
            overlap,
            color='primary',
            :value='authenticated && total',
            :content='formatNumber(total)'
          )
            v-icon.pa-1(color='black', style='display: block') fas fa-comment-dots
            span(style='font-size: 0.7em') CHAT
  viewer(v-model='opened')
    v-card
      search(v-if='opened == "search"', @updated='updateCentre')
  v-dialog(
    v-model='placeOpened',
    fullscreen,
    hide-overlay,
    transition='dialog-bottom-transition'
  )
    place-selected(
      v-if='placeOpened',
      @back='closePosts',
      :coordinates='coordinatesSelected'
    )
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
  watch: {
    $route(route) {
      if (route.hash === '') {
        this.opened = ''
      }
    },
  },
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
  },
  methods: {
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
            self.$store.dispatch('chat/joinNearby')
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
      this.$router.push({ hash: 'search' })
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

<style>
.masonry {
  column-count: 2;
  column-gap: 1em;
}
</style>
