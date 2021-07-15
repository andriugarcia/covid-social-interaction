<template lang="pug">
#locationSelect
  MglMap(
    :accessToken='accessToken',
    :mapStyle='mapStyle',
    logoPosition='bottom-left',
    :maxZoom='16',
    :dragRotate='false',
    :center.sync='centre',
    :zoom='zoom',
    :pitch='30',
    @load='onLoad',
    @movestart='moving = true',
    @moveend='moving = false',
    style='position: absolute; top: 0; left: 0; right: 0; bottom: 0'
  )
  v-layout.pa-4(style='position: absolute; top: 0; left: 0; right: 0')
    v-btn.mt-3(icon, @click='$emit("back")') 
      v-icon fas fa-arrow-left
    v-dialog(
      v-model='searchOpened',
      fullscreen,
      hide-overlay,
      transition='dialog-bottom-transition'
    )
      template(v-slot:activator='{ on, attrs }')
        v-text-field.ml-2(
          outlined,
          flat,
          solo,
          rounded,
          append-icon='fas fa-search',
          readonly,
          hide-details,
          v-on='on',
          placeholder='Buscar sitio'
        )
      v-card
        search(
          @back='searchOpened = false',
          @updated='updateCentre',
          onlyPlaces
        )
  v-layout(
    column,
    align-center,
    style='position: absolute; top: calc(50% - 30px); left: 50%'
  )
    v-icon(
      color='primary',
      size='46',
      :class='{ moving: moving, notmoving: !moving }'
    ) fas fa-map-marker-alt
    .dot
    //- v-card.pa-2.rounded-lg
      div {{ centre.lng.toFixed(4) }}, {{ centre.lat.toFixed(4) }}
    //- .triangle
  v-layout.pa-4(
    style='position: absolute; left: 0; right: 0; bottom: 12px',
    justify-center
  )
    v-btn(
      rounded,
      color='primary',
      :disabled='moving',
      depressed,
      @click='select'
    ) Seleccionar Aquí
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
    zoom: {
      type: Number,
      default: 15,
    },
  },

  data() {
    return {
      accessToken: process.env.MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      centre: { ...this.$store.state.map.userPosition },
      searchOpened: false,
      currentPosition: true,
      moving: false,
    }
  },

  mounted() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
    this.map = null
  },

  _destroyed() {
    this.mapbox = null
    this.map = null
  },

  methods: {
    select() {
      this.$emit('updated', this.centre)
      this.$emit('back')
    },

    onLoad(ev) {
      this.map = ev.map
      const self = this
      setTimeout(() => {
        console.log('RESIZING')
        self.map.resize()
      }, 600)
    },

    updateCentre(coordinates) {
      this.centre = coordinates
    },
  },
}
</script>

<style>
.triangle {
  width: 0;
  height: 0;
  border-bottom: 0 solid black;
  border-top: 9px solid black;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #f0134d;
}

.moving {
  bottom: 24px;
}

.notmoving {
  bottom: 0;
}
</style>
