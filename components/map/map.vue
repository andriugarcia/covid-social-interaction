<template lang="pug">
#map
  MglMap(
    :accessToken='accessToken',
    :mapStyle='mapStyle',
    logoPosition='bottom-left',
    :minZoom='3',
    :center.sync='mapPosition',
    @load='onLoad',
    @moveend='onMove',
    :class='{ "logo-up": hasPortals, "logo-down": !hasPortals }',
    :zoom.sync='zoom',
    :pitch='20',
    style='position: absolute; top: 0; left: 0; right: 0; bottom: 0',
    @click='mapClick'
  )
    MglMarker(
      v-for='(post, i) in posts',
      :key='`${markerKey}-${post.post_id}-${i}`',
      :coordinates='[post.coordinates.lng, post.coordinates.lat]',
      :offset='[0, -10]',
      anchor='bottom'
    )
      template(slot='marker')
        post(:type='post.type', :content='post')
    MglMarker(
      v-if='userPosition',
      :coordinates='[userPosition.lng, userPosition.lat]'
    )
      template(slot='marker')
        .cursor
</template>

<script>
import { MglMap, MglMarker } from 'vue-mapbox'
import Mapbox from 'mapbox-gl'
import Post from './post.vue'
export default {
  components: {
    MglMap,
    MglMarker,
    Post,
  },

  data() {
    return {
      accessToken: process.env.MAPBOX_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      bounds: {},
      timer: false,
      taps: 0,
      markerKey: 0, // Force re-render key
      moveTimeout: null, // Debounce for map moves
    }
  },

  computed: {
    locationEnabled() {
      return this.$store.state.map.locationEnabled
    },
    hasPortals() {
      return this.$store.getters['auth/hasPortals']
    },
    zoom: {
      get() {
        return this.$store.state.map.zoom
      },
      set(value) {
        this.$store.commit('map/setZoom', value)
      },
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
        if (
          value.lat !== this.$store.state.map.mapPosition.lat &&
          value.lat !== this.$store.state.map.mapPosition.lng
        )
          this.$store.commit('map/setMapPosition', value)
      },
    },
    posts() {
      return this.$store.state.post.posts
    },
  },

  watch: {
    $route(route) {
      if (this.map) this.map.resize()
    },
    posts(newPosts) {
      // Force re-render of markers
      this.markerKey += 1
    },
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template

    this.mapbox = Mapbox
    this.map = null
  },

  methods: {
    tryLocation() {
      const self = this
      navigator.geolocation.getCurrentPosition(
        function (position) {
          self.updatePosition(position)
        },
        (error) => {
          console.error(error)
        },
        { timeout: 10000 }
      )
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
    iOS() {
      return (
        [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod',
        ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
      )
    },
    mapClick(map) {
      if (this.iOS()) return
      this.taps += 1

      if (!this.timer) {
        this.timer = true
        setTimeout(() => {
          if (this.taps == 1) {
            this.$emit('click', map.mapboxEvent.lngLat)
          }
          this.timer = false
          this.taps = 0
        }, 500)
      }
    },
    onLoad(ev) {
      this.map = ev.map
      this.$store.commit('map/setEventActions', ev.component.actions)
      this.$store.dispatch('post/getPosts', ev.map.getBounds())
    },
    onMove(ev) {
      // Don't regenerate posts if a post dialog is currently open
      if (this.$route.query.post) {
        return
      }
      
      // Debounce the post generation to avoid too many calls during active panning
      if (this.moveTimeout) {
        clearTimeout(this.moveTimeout)
      }
      this.moveTimeout = setTimeout(() => {
        this.$store.dispatch('post/getPosts', ev.map.getBounds())
      }, 300) // Wait 300ms after user stops moving
    },
  },
}
</script>

<style scoped lang="scss">
.cursor {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #f0134d;
  border: 3px solid white;
  -moz-box-shadow: 0 0 10px #ccc;
  -webkit-box-shadow: 0 0 10px #ccc;
  box-shadow: 0 0 10px #ccc;
}
</style>
