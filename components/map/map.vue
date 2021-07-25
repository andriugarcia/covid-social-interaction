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
      :key='post.post_id || post.chat_id',
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
      taps: 0,
      accessToken: process.env.MAPBOX_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      bounds: {},
    }
  },

  computed: {
    locationEnabled() {
      return this.$store.state.map.locationEnabled
    },
    hasPortals() {
      console.log('hasPortals:', this.$store.getters['auth/hasPortals'])
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
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    console.log('CREATED MAP', { ...this.mapPosition })
    this.mapbox = Mapbox
    this.map = null
  },

  methods: {
    tryLocation() {
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
    mapClick(map) {
      this.taps++
      if (this.taps === 1) {
        this.timer = setTimeout(() => {
          this.$emit('click', map.mapboxEvent.lngLat)
          this.taps = 0
        }, 500)
      } else {
        clearTimeout(this.timer)
        this.taps = 0
      }
    },
    onLoad(ev) {
      console.log('%cCargando mapa', 'background-color: blue; color: white')
      this.map = ev.map
      this.$store.commit('map/setEventActions', ev.component.actions)
      this.$store.dispatch('post/getPosts', ev.map.getBounds())
    },
    onMove(ev) {
      this.$store.dispatch('post/getPosts', ev.map.getBounds())
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
