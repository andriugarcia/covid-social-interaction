<template lang="pug">
  #map
    MglMap(:accessToken="accessToken" :mapStyle="mapStyle", logoPosition="bottom-left", 
          :maxZoom="16", :dragRotate="false", :center.sync="mapPosition", @load="onLoad", @moveend="onMove",
          :zoom="14", :pitch="30", style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;", @click="mapClick")
      MglMarker(:coordinates="[userPosition.lng, userPosition.lat]")
        template(slot="marker")
          .cursor
      MglMarker(v-for="(post, i) in posts" :key="post.post_id || post.chat_id" :coordinates="[post.coordinates.lat, post.coordinates.lng]" :offset="[0, -10]" anchor="bottom")
        template(slot="marker")
          post(:type="post.type", :content="post")
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
    }
  },

  computed: {
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

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },

  methods: {
    mapClick(map) {
      this.$emit('click', map.mapboxEvent.lngLat)
    },
    onLoad(ev) {
      this.$store.dispatch('post/getPosts', ev.map.getBounds())
    },
    onMove(ev) {
      this.$store.dispatch('post/getPosts', ev.map.getBounds())
    },
  },
}
</script>

<style scoped>
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
