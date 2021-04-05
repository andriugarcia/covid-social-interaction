<template lang="pug">
  #events
    v-toolbar(color="primary", dark, style="position: fixed; top: 0; width: 100%; z-index: 20")
      v-btn(icon, @click="$router.go(-1)")
        v-icon fas fa-arrow-left
      v-toolbar-title Eventos
      v-spacer
      v-btn(color="white", rounded, depressed, dark, small, @click="createEvent")
        .primary--text.text-capitalize Nuevo Evento
    .pa-4.mt-12(v-if="authenticated")
      .font-weight-black(style="font-size: 1.4em") Próximos Eventos
      v-layout.my-2(style="overflow-x: scroll")
        v-card.rounded-xl.pa-1.mr-2(v-for="(participation, i) in user.participation", :color="categories[participation.event.category].color", @click="$router.push({ path: `/events/${participation.event.event_id}` })", dark, style="font-size: .7em")
          v-layout(align-center, style="height: 100%")
            v-avatar.mr-2.rounded-xl(tile)
              v-img(:src="participation.event.profile.profile_picture")
            div.pr-1
              .text-uppercase.font-weight-bold(style="white-space: nowrap") {{ participation.event.start_date | toDateShort }}
              span(style="white-space: nowrap") A 700 metros
      .font-weight-black(style="font-size: 1.4em") Eventos cerca
      v-card.mb-2.rounded-xl(v-for="(event, i) in events", outlined, @click="$router.push({ path: `/events/${event.event_id}` })")
        v-img(:src="event.cover", height="160")
        category(:cat="event.category")
        v-layout.px-4.mt-2(justify-space-between, align-center)
          .font-weight-light {{ event.start_date | toDate }} {{ event.start_date | toHour }}
          v-chip 
            span.mr-1 {{ event.participants }}
            v-icon(small) fas fa-users
        v-card-title {{ event.title }}
        v-layout
          em.pb-2.ml-4 a {{ haversineDistance([userPosition.lng, userPosition.lat], [event.place.lng, event.place.lat]) }}km

</template>

<script>
import loginMixin from '@/mixins/login'
import AvatarGroup from '@/components/avatar-group'
import Category from '@/components/event/category'
import geo from '@/mixins/geo'
import date from '@/mixins/date'

export default {
  components: {
    AvatarGroup,
    Category,
  },
  mixins: [geo, date, loginMixin],
  data() {
    return {
      events: [],
      categories: this.$store.state.event.categories,
    }
  },
  computed: {
    userPosition() {
      return this.$store.state.map.userPosition
    },
    user() {
      return this.$store.state.auth.user
    },
    authenticated() {
      return this.$store.state.auth.authenticated
    },
  },
  async mounted() {
    this.events = await this.$store.dispatch(
      'event/getEvents',
      this.$store.state.map.userPosition
    )
  },
  methods: {
    createEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      this.$router.push({ path: '/events/new' })
    },
  },
}
</script>
