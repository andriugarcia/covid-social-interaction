<template lang="pug">
#search
  v-layout.pa-4(flat, dark)
    v-btn(
      v-if='!$vuetify.breakpoint.mdAndUp',
      icon,
      @blur='searchText = ""',
      @click='$router.replace({ hash: "" })'
    )
      v-icon fas fa-arrow-left
    v-text-field.ml-2(
      solo,
      outlined,
      flat,
      dense,
      light,
      rounded,
      v-model='searchText',
      @keydown.enter='select(0)',
      append-icon='fas fa-search',
      placeholder='Buscar sitio',
      hide-details,
      autofocus
    )
  v-card(
    v-if='searchText.length > 0 && places.length > 0',
    flat,
    :style='$vuetify.breakpoint.mdAndUp ? "width: 400px; position: absolute; top: 82px; border: 1px solid #F0134D;" : ""'
  )
    v-list
      div(v-if='!onlyPlaces && users.length > 0')
        v-subheader USUARIOS
        v-list-item(
          v-for='(user, i) in users',
          :key='i',
          @click='selectUser(user)'
        )
          v-list-item-avatar
            v-img(:src='user.profile_picture')
          v-list-item-content
            v-list-item-title {{ user.username }}
      v-subheader(v-if='places.length != 0') SITIOS
      v-list-item(v-for='(place, i) in places', :key='i', @click='select(i)')
        v-list-item-avatar
          v-icon.black--text fas fa-map-marker-alt
        v-list-item-content
          v-list-item-title {{ place.name }}
          v-list-item-subtitle.font-italic {{ place.distance }} km
  v-card(
    v-else-if='searchText != ""',
    flat,
    :style='$vuetify.breakpoint.mdAndUp ? "width: 400px; position: absolute; top: 82px; border: 1px solid #F0134D;" : ""'
  )
    .pa-4 No hemos encontrado ningún lugar con este nombre
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
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchText}.json?proximity=${this.userPosition.lng},${this.userPosition.lat}&autocomplete=true&access_token=${process.env.MAPBOX_TOKEN}`,
          { withCredentials: false }
        ),
        axios.get(`${process.env.SERVER_URL}/users/find/${this.searchText}`),
      ])

      this.users = users

      this.places = places.features
        .map((place) => {
          return {
            name: place.place_name,
            coordinates: place.center,
            bbox: place.bbox,
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
      if (typeof this.places[index].bbox !== 'undefined') {
        if (this.onlyPlaces) {
          this.$emit('updateByBbox', this.places[index].bbox)
        } else {
          this.$store.commit('map/fitBounds', this.places[index].bbox)
        }
      } else {
        if (this.onlyPlaces) {
          this.$emit('updateByCoordinates', this.places[index].coordinates)
        } else {
          this.$store.commit('map/flyTo', this.places[index].coordinates)
        }
      }
      this.$router.replace({ hash: '' })
      this.searchText = ''
    },
    selectUser(user) {
      this.$router.push({ path: '/' + user.username })
      this.searchText = ''
    },
  },
}
</script>
