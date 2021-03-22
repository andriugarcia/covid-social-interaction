<template lang="pug">
  #map
    MglMap(:accessToken="accessToken" :mapStyle="mapStyle", logoPosition="bottom-left", 
          :maxZoom="16", :dragRotate="false", :center.sync="center", @load="onLoad", @moveend="onMove", @update:center="updateCenter"
          :zoom="14", :pitch="30", style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;", @click="mapClick")
      MglMarker(:coordinates="[userPosition.lng, userPosition.lat]")
        template(slot="marker")
          .cursor
      MglMarker(v-for="(post, i) in posts" :key="post._id" :coordinates="[post.coordinates.lat, post.coordinates.lng]" :offset="[0, -10]" anchor="bottom")
        template(slot="marker")
          post(:type="post.type", :content="{...post, id: post.post_id}")
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

  props: {
    mapPosition: {
      type: Object,
      default: () => ({
        lng: 0,
        lat: 0,
      }),
    },
    userPosition: {
      type: Object,
      default: () => ({
        lng: 0,
        lat: 0,
      }),
    },
  },

  data() {
    return {
      accessToken: process.env.MAPBOX_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      bounds: {},
    }
  },

  computed: {
    center: {
      get() {
        return this.mapPosition
      },
      set() {},
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
    updateCenter(center) {
      this.$emit('onMove', center)
    },
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
