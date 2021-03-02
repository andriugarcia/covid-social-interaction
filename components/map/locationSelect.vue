<template lang="pug">
  #locationSelect
    MglMap(:accessToken="accessToken" :mapStyle="mapStyle", logoPosition="bottom-left", 
            :maxZoom="16", :dragRotate="false", :center.sync="centre"
            :zoom="14", :pitch="30", style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;")
    v-layout.pa-4(style="position: absolute; top: 0; left: 0; right: 0;")
      v-btn.mt-3(icon, @click="$emit('back')") 
        v-icon fas fa-arrow-left
      v-dialog(v-model="searchOpened", fullscreen, hide-overlay, transition="dialog-bottom-transition")
        template(v-slot:activator="{on, attrs}")
          v-text-field.ml-2(outlined, solo, rounded, append-icon="fas fa-search", readonly, v-on="on", placeholder="Buscar sitio")
        v-card
          search(@back="searchOpened = false", @updated="updateCentre", :centre="centre")
    v-layout(column, align-center, style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);")
      v-card.pa-2.rounded-lg
        div {{ centre.lng.toFixed(4) }}, {{ centre.lat.toFixed(4) }}
      .triangle
    .pa-4(style="position: absolute; left: 0; right: 0; bottom: 12px;")
      v-btn(block, rounded, color="primary", @click="select") Seleccionar Aquí
</template>

<script>
import { MglMap } from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

export default {
  components: {
    MglMap,
    search: () => import('../search/search'),
  },

  props: {
    initialPosition: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      accessToken: process.env.MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      centre: Object.assign({}, this.initialPosition),
      searchOpened: false,
      currentPosition: true,
    }
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },

  methods: {
    select() {
      this.$emit('updated', this.centre)
      this.$emit('back')
    },

    updateCentre(coordinates) {
      this.centre = coordinates
    },
  },
}
</script>
