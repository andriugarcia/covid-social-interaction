<template lang="pug">
v-card.px-4.pt-3(style="border-radius: 24px 24px 0 0;")
  v-toolbar
    v-btn(icon, color="primary", @click="$emit('back')")
      v-icon fas fa-times
    v-toolbar-title.font-weight-black.primary--text En esta zona
  v-tabs(fixed-tabs)
    v-tab
      v-icon.mr-1(small) fas fa-map-pin
      div Posts
    v-tab
      v-icon.mr-1(small) fas fa-flag
      div Eventos
  .masonry.pa-2(style="overflow-y: scroll; height: 80vh;")

</template>

<script>
export default {
  props: {
    coordinates: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
    },
  },
  data() {
    return {
      nearbyPosts: [],
      nearbyEvents: [],
    }
  },
  async fetch() {
    const [nearbyPosts, nearbyEvents] = await Promise.all(
      this.$store.dispatch('post/getNearbyPosts', this.coordinates),
      this.$store.dispatch('event/getNearbyEvents', this.coordinates)
    )

    this.nearbyPosts = nearbyPosts
    this.nearbyEvents = nearbyEvents
  },
}
</script>
