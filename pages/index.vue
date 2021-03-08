<template lang="pug">
  #Home
    Map(:mapPosition="mapPosition", :userPosition.sync="userPosition", @onMove="markersUpdate", @click="morePosts")
    v-layout.pa-4(style="position: absolute; top: 0px; right: 0; left: 0;", justify-space-between)
      v-btn(icon, @click="opened = 'search'")
        v-icon.primary-text fas fa-search
      v-btn(icon)
        v-icon.primary-text fas fa-sync-alt
    //- v-avatar(size="40", color="white", style="position: absolute top: 8px right: 8px")
    //-   v-img(src="https://picsum.photos/200")
    v-layout(column, style="position: absolute; bottom: 32px; right: 12px;")
      v-btn(v-if="authenticated", fab, color="primary")
        v-avatar(color="white")
          v-img(:src="user.profilePicture")
      v-btn(v-else, fab, outlined, color="primary", @click="$store.commit('setLogin', true)")
        v-icon far fa-user
      v-badge.mt-2(overlap, top, left, :value="total", :content="total")
        v-btn(fab, color="primary", dark, @click="$router.push({ path: '/chat' })")
          v-icon far fa-comment-dots
      v-btn.mt-2(fab, :disabled="!authenticated", @click="$router.push({path: '/editor'})")
        v-icon.primary--text(small) far fa-edit
    v-layout(column, align-center, v-touch="{up: () => activitiesOpened = true}", 
    style="position: absolute; bottom: 32px; left: 80px; right: 80px;")
      v-icon.primary--text(small, @click="activitiesOpened = true") fas fa-chevron-up
      .font-weight-bold.primary--text(@click="activitiesOpened = true") Ver Actividades
    v-dialog(:value="opened", fullscreen, hide-overlay, transition="dialog-bottom-transition")
      v-card
        search(v-if="opened == 'search'", @back="opened = ''", @updated="updateCentre", :centre="userPosition")
    v-bottom-sheet(v-model="placeOpened")
      v-card.px-4.pt-3(style="border-radius: 24px 24px 0 0;")
        v-layout(justify-center)
          v-subheader POSTS EN ESTA ZONA
        .masonry.pa-2(style="overflow-y: scroll; height: 80vh;")
          post.mb-2(v-for="(post, i) in fullPosts", :key="i", :type="post._source.type", :content="post._source", grid)
    v-bottom-sheet(v-model="activitiesOpened")
      v-card.px-4.pt-3(style="border-radius: 24px 24px 0 0;")
        v-layout(justify-center)
          v-subheader ACTIVIDADES
        div(style="height: 80vh; overflow-y: scroll")
          v-card.rounded-lg.mb-2(v-for="i in 10", :key="i", outlined, style="border-color: #F0134D; border-width: 2px;")
            v-img(src="https://images.pexels.com/photos/698907/pexels-photo-698907.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260", height="160", style="border-radius: 6px 6px 0 0;")
            v-chip.mt-n6.ml-3(pill, color="purple darken-2") 
              v-icon.mr-1.white--text(small, dark) fas fa-glass-cheers
              .white--text.font-weight-bold Fiesta
            v-layout.px-4(justify-space-between, style="width: 100%;")
              .overline Mie 13 Jul 17:30
              avatar-group(:avatars="['https://picsum.photos/200', 'https://picsum.photos/201', 'https://picsum.photos/202', 'https://picsum.photos/203', 'https://picsum.photos/204', 'https://picsum.photos/205', 'https://picsum.photos/206']", :limit="6")
            v-card-title.font-weight-bold.py-0 Nombre de la Actividad
            v-layout.ml-4.py-1
              v-icon.black--text(small) fas fa-map-marker-alt
              .ml-1.font-italic a 2km
      v-layout.pb-2(justify-center, style="position: absolute; bottom: 0; left: 0; right: 0;")
        v-btn(rounded, color="primary") 
          v-icon.mr-2(small) fas fa-dice
          .text-capitalize Nueva Actividad

</template>

<script>
import Map from '../components/map/map'
import Search from '../components/search/search'
import AvatarGroup from '../components/avatar-group'
import Postbar from '../components/home/postbar'
import Post from '../components/map/post'
export default {
  components: {
    Map,
    Postbar,
    Search,
    AvatarGroup,
    Post,
  },

  data() {
    return {
      opened: '',
      activitiesOpened: false,
      placeOpened: false,
      fullPosts: [],
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    authenticated() {
      return this.$store.getters['auth/authenticated']
    },
    userPosition: {
      get() {
        return this.$store.state.map.userPosition
      },
      set(value) {
        this.$store.commit('map/setUserPosition', value)
      },
    },
    total() {
      return this.$store.getters['chat/total']
    },
    mapPosition: {
      get() {
        return this.$store.state.map.mapPosition
      },
      set(value) {
        this.$store.commit('map/setMapPosition', value)
      },
    },
  },

  methods: {
    updateCentre(coordinates) {
      this.mapPosition = coordinates
      this.opened = ''
    },

    markersUpdate() {},

    async morePosts(coordinates) {
      const { hits } = await this.$store.dispatch(
        'post/getPostsByPoint',
        coordinates
      )
      this.fullPosts = hits.hits
      this.placeOpened = true
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
