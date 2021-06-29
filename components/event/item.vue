<template lang="pug">
v-card.rounded-xl(
  outlined,
  @click='$router.push({ path: `/events/${event.event_id}` })'
)
  v-layout
    v-sheet.px-3(:color='getColor()', style='border-radius: 24px 0 0 24px')
      v-layout(align-center, style='height: 100%')
        span(style='font-size: 2em') {{ event.emoji }}

    .pa-4(style='width: 100%')
      .font-weight-bold(style='font-size: 1.6em') {{ event.title }}
      .font-weight-bold {{ event.description }}
      span.font-weight-light Miercoles 15 21:30
      v-layout(align-center)
        span.mr-1 {{ event.place_description }}
        v-spacer
        v-icon.mr-1(small) fas fa-map-marker-alt
        span {{ haversineDistance([userPosition.lng, userPosition.lat], [event.place.lng, event.place.lat]) }}km
</template>

<script>
import geo from '@/mixins/geo'
export default {
  mixins: [geo],
  props: ['event'],
  computed: {
    userPosition() {
      return this.$store.state.map.userPosition
    },
  },
  methods: {
    getColor() {
      return (
        (this.$store.state.event.colors[this.event.emoji] || 'gray') +
        ' lighten-3'
      )
    },
  },
}
</script>
