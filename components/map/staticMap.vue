<template lang="pug">
MglMap(
  @click='goToMaps',
  :accessToken='accessToken',
  :mapStyle='mapStyle',
  logoPosition='bottom-left',
  :center.sync='coordinates',
  :zoom='15',
  :interactive='false',
  style='width: 100%; height: 240px'
)
  MglMarker(:coordinates='coordinates')
</template>

<script>
import { MglMap, MglMarker } from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

export default {
  props: ['coordinates'],
  data() {
    return {
      accessToken: process.env.MAPBOX_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      bounds: {},
    }
  },
  components: {
    MglMap,
    MglMarker,
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },
  methods: {
    goToMaps() {
      window.open(
        `https://www.google.com/maps/@${this.coordinates.lat},${this.coordinates.lng},15z`
      )
    },
  },
}
</script>
