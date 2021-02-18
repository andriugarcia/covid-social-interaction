<template lang="pug">
  #map
    MglMap(:accessToken="accessToken" :mapStyle="mapStyle", logoPosition="bottom-left", 
          :maxZoom="16", :dragRotate="false", :center.sync="center", @load="onLoad", @moveend="onMove", @update:center="updateCenter"
          :zoom="14", :pitch="30", style="position: fixed top: 0 left: 0 right: 0 bottom: 0", @click="mapClick")
      MglMarker(:coordinates="userPosition")
        template(slot="marker")
          .cursor
      MglMarker(v-for="(post, i) in posts" :key="i" :coordinates="{lat: post._source.coordinates.lat, lng: post._source.coordinates.lon}" :offset="[0, -10]" anchor="bottom")
        template(slot="marker")
          ;
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
    markers: {
      type: Array,
      default: () => [],
    },
    mapPosition: {
      type: Object,
      default: () => ({}),
    },
    userPosition: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      accessToken: process.env.MAPBOX_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      bounds: {},
      // markers: [
      //   {
      //     type: 'video',
      //     lng: 37.19720886619288,
      //     lat: -3.612036640743373
      //   },
      //   {
      //     type: 'video',
      //     lng: 37.17319576390279,
      //     lat: -3.6082110224474726
      //   },
      //   {
      //     type: 'video',
      //     lng: 37.17419576390279,
      //     lat: -3.6072110224474726
      //   },
      //   {
      //     type: 'video',
      //     lng: 37.17219576390279,
      //     lat: -3.6092110224474726
      //   },
      //   {
      //     type: 'video',
      //     lng: 37.17619576390279,
      //     lat: -3.612110224474726
      //   },
      //   {
      //     type: 'video',
      //     lng: 37.18219576390279,
      //     lat: -3.612110224474726
      //   },
      //   {
      //     type: 'image',
      //     lng: 37.19220886619288,
      //     lat: -3.615036640743373
      //   },
      //   {
      //     type: 'image',
      //     lng: 37.17919576390279,
      //     lat: -3.6012110224474726
      //   },
      //   {
      //     type: 'video',
      //     lng: 37.17282627192832,
      //     lat: -3.5903581370666027
      //   },
      //   {
      //     type: 'video',
      //     lng: 37.160447246678544,
      //     lat: -3.59209705447383
      //   },
      //   {
      //     type: 'short',
      //     lng: 37.173447246678544,
      //     lat: -3.59509705447383
      //   },
      // ]
    }
  },

  computed: {
    center: {
      get() {
        return this.mapPosition
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
  background-color: #4383e9;
  border: 3px solid white;
  -moz-box-shadow: 0 0 10px #ccc;
  -webkit-box-shadow: 0 0 10px #ccc;
  box-shadow: 0 0 10px #ccc;
}
</style>
