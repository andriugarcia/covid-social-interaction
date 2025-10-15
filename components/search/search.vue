<template lang="pug">
#search
  v-layout.pa-4(flat, dark)
    v-btn(
      v-if='!$vuetify.breakpoint.mdAndUp',
      icon,
      @blur='searchText = ""',
      @click='$router.push({ hash: "" })'
    )
      v-icon fas fa-arrow-left
    v-text-field.ml-2(
      name='search',
      solo,
      outlined,
      flat,
      dense,
      light,
      rounded,
      v-model='searchText',
      @keydown.enter='select(0)',
      append-icon='fas fa-search',
      placeholder='Search place',
      hide-details,
      autofocus
    )
  v-card(
    v-if='searchText.length > 0 && places.length > 0',
    flat,
    :style='$vuetify.breakpoint.mdAndUp ? "width: 400px; position: absolute; top: 82px; border: 1px solid #F0134D; z-index: 10;" : ""'
  )
    v-list
      div(v-if='!onlyPlaces && users.length > 0')
        v-subheader USERS
        v-list-item(
          v-for='(user, i) in users',
          :key='i',
          @click='selectUser(user)'
        )
          v-list-item-avatar
            v-img(:src='user.profile_picture')
          v-list-item-content
            v-list-item-title {{ user.username }}
      v-subheader(v-if='places.length != 0') PLACES
      v-list-item(v-for='(place, i) in places', :key='i', @click='select(i)')
        v-list-item-avatar
          v-icon.black--text fas fa-map-marker-alt
        v-list-item-content
          v-list-item-title {{ place.name }}
          v-list-item-subtitle.font-italic(v-if='place.distance') {{ place.distance }} km
  v-card(
    v-else-if='searchText != ""',
    flat,
    :style='$vuetify.breakpoint.mdAndUp ? "width: 400px; position: absolute; top: 82px; border: 1px solid #F0134D;" : ""'
  )
    .pa-4 We couldn't find any place with this name
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

      let proximity = ''
      if (this.userPosition) {
        proximity = `&proximity=${this.userPosition.lng},${this.userPosition.lat}`
      }

      const [{ data: places }, users] = await Promise.all([
        axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchText}.json?autocomplete=true&access_token=${process.env.MAPBOX_TOKEN}${proximity}`,
          { withCredentials: false }
        ),
        // Use store action for demo users instead of direct API call
        this.$store.dispatch('user/findUsers', this.searchText),
      ])

      this.users = users

      this.places = places.features
        .map((place) => {
          return {
            name: place.place_name,
            coordinates: place.center,
            bbox: place.bbox,
            distance: this.userPosition
              ? this.haversineDistance(
                  [this.userPosition.lng, this.userPosition.lat],
                  place.center,
                  false
                )
              : null,
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
      this.$router.push({ hash: '' })
      this.searchText = ''
    },
    selectUser(user) {
      this.$router.replace({ path: '/' + user.username })
      this.searchText = ''
    },
  },
}
</script>
