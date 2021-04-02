<template lang="pug">
  #search.pa-4
    v-layout
      v-btn.mt-3(v-if="!$vuetify.breakpoint.mdAndUp", icon, @click="$router.replace({ hash: '' })")
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
import geo from '@/mixins/geo'

export default {
  mixins: [geo],

  data: () => ({
    searchText: '',
    places: [],
  }),

  computed: {
    userPosition: {
      get() {
        return this.$store.state.map.userPosition
      },
      set(value) {
        this.$store.commit('map/setUserPosition', value)
      },
    },
  },

  watch: {
    async searchText(value) {
      if (value === '') {
        this.places = []
      }
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchText}.json?proximity=${this.userPosition.lng},${this.userPosition.lat}&autocomplete=true&access_token=${process.env.MAPBOX_TOKEN}`
      )
      this.places = data.features
        .map((place) => {
          return {
            name: place.place_name,
            coordinates: place.center,
            distance: this.haversineDistance(
              [this.userPosition.lng, this.userPosition.lat],
              place.center,
              false
            ),
          }
        })
        .slice(0, 6)
    },
  },

  methods: {
    select(index) {
      this.$emit('updated', {
        lng: this.places[index].coordinates[0],
        lat: this.places[index].coordinates[1],
      })
    },
  },
}
</script>
