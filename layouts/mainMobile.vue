<template lang="pug">
#Home
  Map(@click='morePosts')
  v-layout.pa-4(
    style='position: absolute; top: 0px; right: 0; left: 0',
    align-center
  )
    img(src='@/assets/olimaps-logo.png', style='width: 36px; height: 36px')
    img(src='@/assets/olimaps-logo-light.png', style='height: 30px')
    v-spacer
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
      @click='$store.commit("setLogin", true)'
    )
      v-icon.mr-2(small) fas fa-user
      span.text-capitalize Crear Cuenta

  .pb-8(style='position: fixed; bottom: 0; left: 0; right: 0')
    portals.pl-2
    v-card.mx-2.mt-2.rounded-xl(outlined)
      v-layout(justify-space-around, align-center)
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
            :value='authenticated',
            :content='formatNumber(3)'
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
      search(
        v-if='opened == "search"',
        @back='opened = ""',
        @updated='updateCentre'
      )
  v-dialog(
    v-model='placeOpened',
    fullscreen,
    hide-overlay,
    transition='dialog-bottom-transition'
  )
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
    if (to.hash === '') {
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
      this.$store.commit('map/flyToMe')
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
