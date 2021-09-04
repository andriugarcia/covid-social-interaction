<template lang="pug">
#eventItem
  v-card.rounded-lg(
    v-if='!small',
    outlined,
    @click='$router.push({ path: `/events/${event.event_id}` })'
  )
    v-layout
      v-sheet.px-3(:color='getColor()', style='border-radius: 8px 0 0 8px')
        v-layout(align-center, style='height: 100%')
          span(style='font-size: 2em') {{ event.emoji }}

      .pa-4(style='width: 100%')
        .font-weight-medium(style='font-size: 1.2em') {{ event.title }}
        //- .font-weight-bold {{ event.description }}
        span.font-weight-light {{ event.start_date | toDateShort }}
        v-layout(align-center)
          span.mr-1 {{ event.place_description }}
          v-spacer
          v-icon.mr-1(small) fas fa-map-marker-alt
          span {{ haversineDistance([userPosition.lng, userPosition.lat], [event.place.lng, event.place.lat]) }}km
  v-card.rounded-xl(
    v-else,
    outlined,
    style='max-width: 240px; height: 120px',
    @click='$router.push({ path: `/events/${event.event_id}` })'
  ) 
    //- v-img(
    //-   style='height: 46px',
    //-   src='https://cdn.pixabay.com/photo/2017/08/06/18/35/night-2594984_1280.jpg'
    //- )
    .px-4.py-2(style='width: 100%')
      v-chip.pl-0(:color='getColor()', small)
        v-avatar(color='white')
          span(style='font-size: 1.4em') {{ event.emoji }}
        span.font-weight-medium.ml-2 {{ getCategoryName(event.emoji) }}
      .font-weight-medium.text-truncate.mt-2(style='font-size: 0.8em') {{ event.title }}
      span.font-weight-medium(style='font-size: 0.7em') {{ event.place_description }}
      .text--text.font-weight-medium(
        style='position: absolute; bottom: 8px; left: 16px; font-size: 0.7em'
      ) {{ event.start_date | toDateShort }}
      //- v-layout
        v-icon.mr-1(small) fas fa-map-marker-alt
        span {{ haversineDistance([userPosition.lng, userPosition.lat], [event.place.lng, event.place.lat]) }}km
</template>

<script>
import geo from '@/mixins/geo'
import date from '@/mixins/date'

export default {
  mixins: [geo, date],
  props: {
    event: Object,
    small: {
      type: Boolean,
      default: false,
    },
  },
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
    getCategoryName(emoji) {
      return this.$store.state.event.categories.find(
        (category) => category.emoji === emoji
      ).name
    },
  },
}
</script>
