<template lang="pug">
  #search.pa-4
    v-layout
      v-btn.mt-3(v-if="!$vuetify.breakpoint.mdAndUp", icon)
        v-icon.black--text fas fa-arrow-left
      v-text-field.ml-2(outlined, rounded, v-model="searchText", @keydown.enter="select(0)", append-icon="fas fa-search", placeholder="Buscar sitio", autofocus)
    v-card(flat)
      v-list(v-if="places.length > 0")
        v-list-item(v-for="(place, i) in places", :key="i", @click="select(i)")
          v-list-item-avatar
            v-icon.black--text fas fa-map-marker-alt
          v-list-item-content
            v-list-item-title {{place.name}}
            v-list-item-subtitle.font-italic {{place.distance}} km
      .pa-4(v-else-if="searchText != ''") No hemos encontrado ningún lugar con este nombre
</template>

<script>
import axios from 'axios'
export default {
  props: {
    centre: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    searchText: '',
    places: [],
  }),

  watch: {
    async searchText(value) {
      if (value === '') {
        this.places = []
      }
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchText}.json?proximity=${this.centre.lng},${this.centre.lat}&autocomplete=true&access_token=${process.env.MAPBOX_TOKEN}`
      )
      this.places = data.features
        .map((place) => {
          return {
            name: place.place_name,
            coordinates: place.center,
            distance: this.haversineDistance(
              [this.centre.lng, this.centre.lat],
              place.center,
              false
            ),
          }
        })
        .slice(0, 6)
    },
  },

  methods: {
    haversineDistance(coords1, coords2, isMiles) {
      function toRad(x) {
        return (x * Math.PI) / 180
      }

      const lon1 = coords1[0]
      const lat1 = coords1[1]

      const lon2 = coords2[0]
      const lat2 = coords2[1]

      const R = 6371 // km

      const x1 = lat2 - lat1
      const dLat = toRad(x1)
      const x2 = lon2 - lon1
      const dLon = toRad(x2)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      let d = R * c

      if (isMiles) d /= 1.60934

      return d.toFixed(2)
    },

    select(index) {
      this.$emit('updated', {
        lng: this.places[index].coordinates[0],
        lat: this.places[index].coordinates[1],
      })
    },
  },
}
</script>
