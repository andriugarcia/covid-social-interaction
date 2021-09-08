<template lang="pug">
#event(
  v-if='event && !loadingEvent',
  style='position: relative; inset: 0; width: 100%'
)
  v-toolbar(absolute, color='primary', dark, flat, style='left: 0; right: 0')
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    span.text-truncate {{ event.title }}
    v-spacer
    v-btn(icon, @click='shareDialog = true')
      v-icon fas fa-share-alt
  v-sheet.pt-6(color='white', style='height: 100vh; overflow-y: scroll')
    div(style='height: 64px')
    div(v-if='event.image')
      img(
        :src='event.image',
        style='height: 240px; width: 100%; object-fit: cover; object-position: center'
      )
      v-btn(absolute, top, left, icon, dark, @click='$router.go(-1)')
        v-icon fas fa-arrow-left
    //- category(:cat="event.category")
    .px-4
      v-layout(align-end)
        v-chip.pl-1(:color='getColor()')
          v-avatar(color='white')
            span(style='font-size: 1em') {{ event.emoji }}
          span.font-weight-medium.ml-2 {{ getCategoryName(event.emoji) }}
        .text-uppercase.font-weight-medium.ml-2 {{ event.start_date | toDateShort }}

      span(style='font-size: 2em; font-weight: 700; letter-spacing: -1px') {{ event.title }}
      p.font-weight-light.mt-4 {{ event.description }}
      v-layout.my-4(
        align-center,
        @click='$router.push({ path: "/" + event.username })'
      )
        v-avatar(style='border: 3px solid #f0134d')
          v-img(:src='event.profile_picture')
        .ml-3
          .font-weight-light Anfitrión
          .font-weight-bold {{ event.username }}
        v-spacer
        v-btn(
          v-if='event.profile_id != user.profile_id',
          rounded,
          small,
          depressed,
          :outlined='!event.follow',
          color='primary',
          @click='follow'
        ) {{ event.follow ? "Siguiendo" : "Seguir" }}
      .overline.text-uppercase.mt-2.font-weight-bold Ubicación
      p {{ event.place_description }}
      static-map(:coordinates='event.place')
      .overline.text-uppercase.mt-2.font-weight-bold Horario
      v-timeline.pl-0(align-top, dense)
        v-timeline-item(color='blue', small)
          v-row.pt-1
            v-col(cols='3')
              strong Inicio
            v-col
              strong {{ event.start_date | toDate }}
              div {{ event.start_date | toHour }}
        v-timeline-item(color='primary', small)
          v-row.pt-1
            v-col(cols='3')
              strong Fin
            v-col
              strong {{ event.end_date | toDate }}
              div {{ event.end_date | toHour }}
      div(v-if='event.chat_id')
        .overline.text-uppercase.mt-2.font-weight-bold CHAT GRUPAL
        v-card.pa-2.rounded-xl(
          outlined,
          @click='$router.push({ path: `/group/${event.chat_id}` })'
        )
          v-layout(align-center)
            v-avatar(style='border: 3px solid #f0134d')
              v-img(:src='event.cover')
            .ml-3
              .font-weight-bold {{ event.chatname }}
            v-spacer
            v-btn.rounded-lg(small, depressed, color='primary') Ver grupo
      .overline.text-uppercase.mt-4.font-weight-bold(
        v-if='event.participants.length > 1'
      ) {{ event.participants.length }} Participantes
      v-layout(v-if='event.participants.length > 1', wrap)
        v-flex.pa-2(
          v-for='(participant, i) in event.participants',
          :key='i',
          xs4
        )
          v-card.pa-2.py-4.text-center.rounded-xl(
            outlined,
            @click='$router.push({ path: "/" + participant.profile.username })'
          )
            v-layout(column, align-center)
              v-avatar
                v-img(:src='participant.profile.profile_picture')
              span.font-weight-bold {{ participant.profile.username }}
      .mb-12.pb-6
    .pa-2(
      v-if='eventState() == states.PROMOTION',
      style='position: absolute; bottom: 0; left: 0; right: 0'
    )
      v-dialog(
        v-if='event.joined && event.participation && event.participation.is_host'
      )
        template(v-slot:activator='{ on }')
          v-btn(
            v-on='on',
            block,
            dark,
            large,
            color='primary',
            style='z-index: 10',
            rounded
          ) Cancelar Evento
        v-card.pa-4.rounded-xl
          .overline CANCELAR EVENTO
          p ¿Estás seguro de querer cancelar el evento?
          v-layout(justify-space-between)
            v-btn(rounded, text) ATRÁS
            v-btn(rounded, dark, depressed, color='red', @click='cancelEvent') CANCELAR
      v-btn(
        v-else-if='!event.joined',
        block,
        dark,
        large,
        color='primary',
        rounded,
        style='z-index: 10',
        @click='joinEvent'
      ) Asistir
      v-dialog(v-else, v-model='unjoinDialog')
        template(#activator)
          v-btn(
            block,
            dark,
            large,
            color='primary',
            style='z-index: 10',
            @click='unjoinDialog = true',
            rounded
          ) Cancelar Asistencia
        v-card.pa-4.rounded-xl
          .overline CANCELAR ASISTENCIA
          p ¿Estás seguro de querer cancelar tu asistencia al evento?
          v-layout(justify-space-between)
            v-btn(rounded, text, @click='unjoinDialog = false') ATRÁS
            v-btn(rounded, dark, depressed, color='red', @click='unjoinEvent') CANCELAR
  v-bottom-sheet(v-model='shareDialog', :inset='$vuetify.breakpoint.mdAndUp')
    share(:event='event', @back='shareDialog = false')
  v-dialog(v-model='askGroupDialog')
    v-card.pa-4
      v-subheader Participar en el grupo
      p ¿Quieres participar también en el grupo del evento para conocer a los asistentes?
      v-layout(justify-space-between)
        v-btn(text, @click='askGroupDialog = false') No quiero
        v-btn(color='primary', @click='joinChat') Participar
v-sheet.pa-4(v-else-if='loadingEvent', color='white', style='height: 100vh')
  v-layout.mt-6(justify-center)
    v-progress-circular(size='64', indeterminate, color='primary')
v-sheet.pa-4(v-else, color='white', style='height: 100vh')
  v-card.ma-2.rounded-xl(outlined)
    v-layout.pa-6.text-center(
      column,
      justify-center,
      align-center,
      color='white',
      style='height: 100%'
    )
      v-icon(color='primary', x-large) far fa-sad-cry
      .mt-4.black--text Evento no encontrado
      .black--text El evento que buscas no existe o ha sido cancelado
      v-btn.mt-2(
        block,
        rounded,
        depressed,
        color='primary',
        @click='$router.replace({ path: "/events" })'
      ) Ver Otros Eventos
</template>

<script>
import loginMixin from '@/mixins/login'
import AvatarGroup from '@/components/avatar-group'
import StaticMap from '@/components/map/staticMap'
import date from '@/mixins/date'

export default {
  components: {
    AvatarGroup,
    StaticMap,
    share: () => import('@/components/map/share.vue'),
  },
  mixins: [date, loginMixin],
  data() {
    return {
      event: null,
      eventNotFound: false,
      loadingEvent: true,
      shareDialog: false,
      askGroupDialog: false,
      unjoinDialog: false,
      states: {
        PROMOTION: 0,
        STARTED: 1,
        END: 2,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  async fetch() {
    try {
      this.event = await this.$store.dispatch(
        'event/getEvent',
        this.$route.params.event
      )
    } catch (e) {
      this.eventNotFound = true
    }
    this.loadingEvent = false
  },

  methods: {
    getCategoryName(emoji) {
      return this.$store.state.event.categories.find(
        (category) => category.emoji === emoji
      ).name
    },
    follow() {
      if (this.event.follow) {
        this.$store.dispatch('user/unfollow', this.event.profile_id)
        this.event.follow = false
      } else {
        this.$store.dispatch('user/follow', this.event.profile_id)
        this.event.follow = true
      }
    },
    eventState() {
      const now = new Date()
      const start = new Date(this.event.start_date)
      const end = new Date(this.event.end_date)

      if (start.getTime() <= now.getTime() && end.getTime() >= now.getTime()) {
        return this.states.STARTED
      } else if (start.getTime() >= now.getTime()) {
        return this.states.PROMOTION
      } else if (end.getTime() <= now.getTime()) {
        return this.states.END
      }
    },
    async joinEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      await this.$store.dispatch('event/joinEvent', this.$route.params.event)
      this.event.joined = true

      console.log(
        this.$store.getters['chat/isParticipantInGroup'](this.event.chat_id)
      )
      if (
        this.event.chat_id &&
        !this.$store.getters['chat/isParticipantInGroup'](this.event.chat_id)
      ) {
        this.askGroupDialog = true
      }
    },
    async joinChat() {
      await this.$store.dispatch('chat/joinChat', this.event.chat_id)
      this.askGroupDialog = false
    },
    async unjoinEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      this.$store.dispatch('event/unjoinEvent', this.$route.params.event)
      this.event.joined = false
      this.unjoinDialog = false
    },
    async cancelEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      await this.$store.dispatch('event/cancelEvent', this.$route.params.event)
      this.$router.replace({ path: '/events' })
    },
    getColor() {
      return (
        (this.$store.state.event.colors[this.event.emoji] || 'gray') +
        ' lighten-3'
      )
    },
    goToMaps() {
      window.open(
        `https://www.google.com/maps/search/?api=1&q=${this.event.place.lat},${this.event.place.lng}+(My%20location)`
      )
    },
  },
}
</script>
