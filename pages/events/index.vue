<template lang="pug">
#events(style='position: relative; height: 100vh')
  v-toolbar(
    color='primary',
    dark,
    flat,
    style='position: absolute; top: 0; width: 100%; z-index: 20'
  )
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    v-toolbar-title Eventos
    v-spacer
    v-btn(color='white', rounded, depressed, dark, small, @click='createEvent')
      .primary--text.text-capitalize Nuevo Evento
  v-sheet.pa-4(
    v-if='authenticated',
    color='white',
    style='height: 100vh; overflow-y: scroll'
  )
    .font-weight-black(style='font-size: 1.4em; margin-top: 60px') Próximos Eventos
    v-alert(
      v-if='user.participation.length === 0',
      color='purple',
      text,
      icon='fas fa-glass-cheers'
    ) No tienes eventos próximamente
    v-layout.my-2(style='overflow-x: scroll')
      event.mb-2(v-for='(event, i) in events', :key='i', :event='event', small)
    .font-weight-black.mt-6(style='font-size: 1.4em') Eventos cerca
    v-alert(
      v-if='events.length === 0',
      type='error',
      text,
      icon='far fa-sad-tear',
      prominent
    ) No hay eventos cerca
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
