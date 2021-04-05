<template lang="pug">
  #event(v-if="event")
    v-app-bar(absolute, color="primary", dark, inverted-scroll, scroll-target="#event-content")
      v-btn(icon, @click="$router.go(-1)")
        v-icon fas fa-arrow-left
      span {{ event.title }}
    v-sheet#event-content.overflow-y-auto(style="height: 100vh")
      v-img(:src="event.cover", height="180")
        v-btn(absolute, top, left, icon, dark, @click="$router.go(-1)")
          v-icon fas fa-arrow-left
      category(:cat="event.category")
      .px-4
        .text-uppercase.font-weight-medium {{ event.start_date | toDateShort }}
        div(style="font-size: 2.4em; font-weight: 700; letter-spacing: -1px;") {{ event.title }}
        p.font-weight-light {{ event.description }}
        v-layout.my-4(align-center, @click="$router.push({ path: '/' + event.profile.username })")
          v-avatar(style="border: 3px solid #F0134D;")
            v-img(:src="event.profile_picture")
          .ml-3
            .font-weight-light Anfitrión
            .font-weight-bold {{ event.username }}
          v-spacer
          v-btn.black--text.text-capitalize.rounded-lg(depressed, small, color="primary lighten-5") Ver Eventos
        .overline.text-uppercase.mt-2.font-weight-bold Ubicación
        p {{ event.place_description }}
        MglMap(@click="goToMaps", :accessToken="accessToken" :mapStyle="mapStyle", logoPosition="bottom-left", 
          :center.sync="event.place", :zoom="15", :interactive="false", style="width: 100%; height: 240px;")
          MglMarker(:coordinates="[event.place.lng, event.place.lat]")
        .overline.text-uppercase.mt-2.font-weight-bold Horario
        v-layout.pl-2
          v-icon(large, color="text") far fa-clock
          .ml-4
            div {{ event.start_date | toDate }}
            div De 17:30 a 20:30
        div(v-if="event.chat_id")
          .overline.text-uppercase.mt-2.font-weight-bold Grupo
          v-card.pa-2.rounded-xl(outlined, @click="$router.push({ path: `/join/${event.chat_id}` })")
            v-layout(align-center)
              v-avatar(style="border: 3px solid #F0134D;")
                v-img(:src="event.cover")
              .ml-3
                .font-weight-bold {{ event.chatname }}
              v-spacer
              v-btn.black--text(small, rounded, depressed, color="primary lighten-4") Entrar
        .overline.text-uppercase.mt-4.font-weight-bold {{ event.participants.length }} Participantes
        v-layout.mb-12.pb-6(wrap)
          v-flex.pa-2(v-for="(participant, i) in event.participants", xs4)
            v-card.pa-2.py-4.text-center.rounded-xl(outlined, @click="$router.push({ path: '/' + participant.profile.username })")
              v-layout(column, align-center)
                v-avatar
                  v-img(:src="participant.profile.profile_picture")
                span.font-weight-bold {{ participant.profile.username }}
    .pa-2(style="position: fixed; bottom: 0; left: 0; right: 0")
      v-btn(v-if="!event.joined", block, dark, large, color="primary", rounded, @click="joinEvent") Asistir
      v-dialog(v-else)
        template(v-slot:activator="{on}")
          v-btn(v-on="on", block, dark, large, color="primary", rounded) Cancelar Asistencia
        v-card.pa-4.rounded-xl
          .overline CANCELAR ASISTENCIA
          p ¿Estás seguro de querer cancelar tu asistencia al evento?
          v-layout(justify-space-between)
            v-btn(rounded, text) SALIR
            v-btn(rounded, dark, depressed, color="red", @click="unjoinEvent") CANCELAR

</template>

<script>
import loginMixin from '@/mixins/login'
import AvatarGroup from '@/components/avatar-group'
import date from '@/mixins/date'

import { MglMap, MglMarker } from 'vue-mapbox'
import Mapbox from 'mapbox-gl'
import Category from '@/components/event/category'

export default {
  components: {
    AvatarGroup,
    MglMap,
    MglMarker,
    Category,
  },
  mixins: [date, loginMixin],
  data() {
    return {
      event: null,
      accessToken: process.env.MAPBOX_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      bounds: {},
    }
  },
  async fetch() {
    this.event = await this.$store.dispatch(
      'event/getEvent',
      this.$route.params.event
    )
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },
  methods: {
    async joinEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      await this.$store.dispatch('event/joinEvent', this.$route.params.event)
      this.event.joined = true
    },
    async unjoinEvent() {
      if (this.openLoginIfNotAuthenticated()) return
      await this.$store.dispatch('event/unjoinEvent', this.$route.params.event)
      this.event.joined = false
    },
    goToMaps() {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${this.event.place.lat},${this.event.place.lng}`
      )
    },
  },
}
</script>
