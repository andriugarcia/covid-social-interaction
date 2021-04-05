<template lang="pug">
  #Home
    Map(@click="morePosts")
    v-layout.pa-4(style="position: absolute; top: 0px; right: 0; left: 0;", align-center)
      img(src="@/assets/olimaps-logo.png", style="width: 36px; height: 36px;")
      img(src="@/assets/olimaps-logo-light.png", style="height: 30px")
      v-spacer
      v-btn.mr-2(small, depressed, fab, @click="flyToMe")
        v-icon(small, color="grey darken-2") fas fa-crosshairs
      v-menu(v-if="authenticated", rounded, offset-y)
        template(v-slot:activator="{on}")
          v-btn(fab, color="primary", v-on="on")
            v-avatar(color="white")
              v-img(:src="user.profile_picture")
        v-card
          v-list
            v-list-item(@click="logout") Cerrar Sesión
      v-btn(v-else, depressed, rounded, color="primary", @click="$store.commit('setLogin', true)")
        v-icon.mr-2(small) fas fa-user
        span.text-capitalize Crear Cuenta

    .pb-8(style="position: fixed; bottom: 0; left: 0; right: 0;")
      portals.pl-2
      v-sheet.mx-2.mt-2.elevation-5.rounded-xl
        v-layout.px-3(justify-space-around, align-center)
          v-card.my-1.px-2.rounded-lg.text-center(flat, @click="$router.push({path: '/events'})")
            v-icon.pa-1(color="black", style="display: block") fas fa-flag
            span.font-weight-bold(style="font-size: .7em") EVENTOS
          v-card.my-1.px-2.rounded-lg.text-center(flat, @click="openSearch")
            v-icon.pa-1(color="black", style="display: block") fas fa-search
            span.font-weight-bold(style="font-size: .7em") BUSCAR
          v-btn(fab, depressed, color="primary", @click="openEditor")
            v-icon fas fa-plus
          v-card.my-1.px-2.rounded-lg.text-center(flat, @click="openActivity")
            v-badge(overlap, color="primary", :value="authenticated", :content="3")
              v-icon.pa-1(color="black", style="display: block") fas fa-bell
              span.font-weight-bold(style="font-size: .7em") ACTIVIDAD
          v-card.my-1.px-2.rounded-lg.text-center(flat, @click="openChat")
            v-badge(overlap, color="primary", :value="authenticated && total", :content="total")
              v-icon.pa-1(color="black", style="display: block") fas fa-comment-dots
              span.font-weight-bold(style="font-size: .7em") CHAT
    //- v-avatar(size="40", color="white", style="position: absolute top: 8px right: 8px")
    //-   v-img(src="https://picsum.photos/200")
    
    //- v-layout(column, style="position: absolute; bottom: 32px; right: 12px;")
      v-btn(v-if="authenticated", fab, color="primary")
        v-avatar(color="white")
          v-img(:src="user.profile_picture")
      v-btn(v-else, fab, outlined, color="primary", @click="$store.commit('setLogin', true)")
        v-icon far fa-user
      v-badge.mt-2(overlap, top, left, :value="total", :content="total")
        v-btn(fab, color="primary", dark, @click="$router.push({ path: '/chat' })")
          v-icon far fa-comment-dots
      v-btn.mt-2(fab, :disabled="!authenticated", @click="$router.push({path: '/editor'})")
        v-icon.primary--text(small) far fa-edit
    //- v-layout(column, align-center, v-touch="{up: () => activitiesOpened = true}", 
    //- style="position: absolute; bottom: 32px; left: 80px; right: 80px;")
      v-icon.primary--text(small, @click="activitiesOpened = true") fas fa-chevron-up
      .font-weight-bold.primary--text(@click="activitiesOpened = true") Ver Actividades
    v-dialog(:value="opened", fullscreen, hide-overlay, transition="dialog-bottom-transition")
      v-card
        notifications(v-if="opened == 'notifications'", @back="opened = ''")
        search(v-if="opened == 'search'", @back="opened = ''", @updated="updateCentre")
    v-dialog(v-model="placeOpened", fullscreen, hide-overlay, transition="dialog-bottom-transition")
      place-selected(@back="closePosts", :coordinates="coordinatesSelected")

</template>

<script>
import loginMixin from '@/mixins/login'
import Map from '../components/map/map'
import Search from '../components/search/search'
import AvatarGroup from '../components/avatar-group'
import Postbar from '../components/home/postbar'
import Post from '../components/map/post'
import Portals from '../components/map/portals'
import Notifications from '../layouts/notifications'

export default {
  components: {
    Map,
    Postbar,
    Search,
    AvatarGroup,
    Post,
    Portals,
    Notifications,
    placeSelected: () => import('@/components/map/placeSelected'),
  },

  mixins: [loginMixin],

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
      this.$router.push({ hash: 'activity' })
      this.opened = 'notifications'
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
