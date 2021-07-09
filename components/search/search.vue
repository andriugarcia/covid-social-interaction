<template lang="pug">
#search.pa-4
  v-layout(align-center)
    v-btn(
      v-if='!$vuetify.breakpoint.mdAndUp',
      icon,
      @blur='searchText = ""',
      @click='$router.replace({ hash: "" })'
    )
      v-icon.black--text fas fa-arrow-left
    v-text-field.ml-2(
      solo,
      outlined,
      flat,
      dense,
      rounded,
      v-model='searchText',
      @keydown.enter='select(0)',
      append-icon='fas fa-search',
      placeholder='Buscar sitio',
      hide-details,
      autofocus
    )
  v-card(flat, :style='$vuetify.breakpoint.mdAndUp ? "width: 400px;" : ""')
    v-list(v-if='places.length > 0')
      div(v-if='!onlyPlaces')
        v-subheader USUARIOS
        v-list-item(
          v-for='(user, i) in users',
          :key='i',
          @click='$router.push({ path: "/" + user.username })'
        )
          v-list-item-avatar
            v-img(:src='user.profile_picture')
          v-list-item-content
            v-list-item-title {{ user.username }}
      v-subheader(v-if='!onlyPlaces') SITIOS
      v-list-item(v-for='(place, i) in places', :key='i', @click='select(i)')
        v-list-item-avatar
          v-icon.black--text fas fa-map-marker-alt
        v-list-item-content
          v-list-item-title {{ place.name }}
          v-list-item-subtitle.font-italic {{ place.distance }} km
    .pa-4(v-else-if='searchText != ""') No hemos encontrado ningún lugar con este nombre
</template>

<script>
import axios from 'axios'
import geo from '@/mixins/geo'

export default {
  mixins: [geo],
  props: {
    onlyPlaces: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    searchText: '',
    places: [],
    users: [],
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

      const [{ data: places }, { data: users }] = await Promise.all([
        axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchText}.json?proximity=${this.userPosition.lng},${this.userPosition.lat}&autocomplete=true&access_token=${process.env.MAPBOX_TOKEN}`
        ),
        axios.get(`${process.env.SERVER_URL}/users/find/${this.searchText}`),
      ])

      this.users = users
      this.places = places.features
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
      console.log(this.places[index])
      this.$store.commit('map/flyTo', this.places[index].coordinates)
      this.$router.replace({ hash: '' })
    },
  },
}
</script>
