<template lang="pug">
#events(style='position: relative')
  v-toolbar(
    color='primary',
    dark,
    style='position: absolute; top: 0; width: 100%; z-index: 20'
  )
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    v-toolbar-title Eventos
    v-spacer
    v-btn(color='white', rounded, depressed, dark, small, @click='createEvent')
      .primary--text.text-capitalize Nuevo Evento
  .pa-4(v-if='authenticated')
    .font-weight-black(style='font-size: 1.4em; margin-top: 60px') Próximos Eventos
    v-layout.my-2(style='overflow-x: scroll')
      v-card.rounded-xl.pa-1.mr-2(
        v-for='(participation, i) in user.participation',
        :key='i',
        :color='getColor(participation.event.emoji)',
        @click='$router.push({ path: `/events/${participation.event.event_id}` })',
        dark,
        style='font-size: 0.7em'
      )
        v-layout(align-center, style='height: 100%')
          v-avatar.mr-2.rounded-xl(tile)
            v-img(:src='participation.event.profile.profile_picture')
          .pr-1
            .text-uppercase.font-weight-bold(style='white-space: nowrap') {{ participation.event.start_date | toDateShort }}
            span(style='white-space: nowrap') A 700 metros
    .font-weight-black.mt-6(style='font-size: 1.4em') Eventos cerca
    event.mb-2(v-for='(event, i) in events', :key='i', :event='event')
</template>

<script>
import loginMixin from '@/mixins/login'
import AvatarGroup from '@/components/avatar-group'
import Category from '@/components/event/category'
import geo from '@/mixins/geo'
import date from '@/mixins/date'
import Event from '@/components/event/item'

export default {
  components: {
    AvatarGroup,
    Category,
    Event,
  },
  mixins: [geo, date, loginMixin],
  data() {
    return {
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
      return this.$store.getters['auth/authenticated']
    },
    events() {
      return this.$store.state.event.events
    },
  },
  methods: {
    createEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      this.$router.push({ path: '/events/new' })
    },
    getColor(emoji) {
      return this.$store.state.event.colors[emoji] || 'gray'
    },
  },
}
</script>
