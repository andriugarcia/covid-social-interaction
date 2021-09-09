<template lang="pug">
#events(style='position: relative; inset: 0; width: 100%')
  v-toolbar(
    color='primary',
    dark,
    flat,
    style='position: absolute; top: 0; width: 100%; z-index: 20'
  )
    v-btn(icon, @click='$router.replace({ path: "/" })')
      v-icon fas fa-arrow-left
    v-toolbar-title Eventos
    v-spacer
    v-btn(color='white', rounded, depressed, dark, small, @click='createEvent')
      .primary--text.text-capitalize Nuevo Evento
  div(ref='scrollarea', style='height: 100vh; overflow-y: scroll')
    v-sheet.pa-4.mt-10(color='white', style='height: 100%')
      v-layout.mt-6.mb-3(v-if='authenticated')
        v-icon.mr-2(color='black') far fa-calendar-alt
        .font-weight-medium(style='font-size: 1.4em') Próximos Eventos
        v-spacer
        v-chip.font-weight-medium(
          v-if='user.participation.length !== 0',
          color='primary'
        ) {{ user.participation.length }}
      v-alert(
        v-if='authenticated && events.length === 0',
        color='purple',
        text,
        icon='fas fa-glass-cheers'
      ) No tienes eventos próximamente
      v-layout.hide-scrollbar.my-2(
        v-if='authenticated',
        style='overflow-x: scroll'
      )
        event.mb-2.mr-2(
          v-for='(event, i) in user.participation',
          :key='i',
          :event='event.event',
          small
        )
      v-layout.mt-6.mb-3
        v-icon.mr-2(color='black') fas fa-map-marked-alt
        .font-weight-medium(style='font-size: 1.4em') Eventos cerca
      //- v-row#loadBar.my-12(justify='center', align='center')
      //-   v-progress-circular(indeterminate, color='primary')
      v-alert(
        v-if='user.participation.length === 0',
        type='error',
        text,
        icon='far fa-sad-tear',
        prominent
      ) No hay eventos cerca
      event.mb-2(v-for='(event, i) in events', :key='i', :event='event')
      .text-center.py-4(v-if='loading')
        v-progress-circular(indeterminate, color='primary')
</template>

<script>
import loginMixin from '@/mixins/login'
import AvatarGroup from '@/components/avatar-group'
import Category from '@/components/event/category'
import geo from '@/mixins/geo'
import date from '@/mixins/date'
import Event from '@/components/event/item'

export default {
  head: {
    title: 'Eventos | Olimaps',
  },
  components: {
    AvatarGroup,
    Category,
    Event,
  },
  mixins: [geo, date, loginMixin],
  data() {
    return {
      categories: this.$store.state.event.categories,
      events: [],
      page: 1,
      loading: false,
      finished: false,
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
  },
  mounted() {
    this.events = this.$store.state.event.events
  },
  methods: {
    createEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      this.$router.push({ path: '/events/new' })
    },
    getColor(emoji) {
      return this.$store.state.event.colors[emoji] || 'gray'
    },
    async handleScroll() {
      if (
        !this.finished &&
        this.$refs.scrollarea.scrollTop + 1000 >=
          this.$refs.scrollarea.scrollHeight &&
        !this.loading
      ) {
        this.loading = true
        const newEvents = this.$store.dispatch('event/getEvents', this.page)
        this.events = [...this.events, ...newEvents]
        this.page++
        if (newEvents.length <= 0) this.finished = true
        this.loading = false
      }
    },
  },
}
</script>
