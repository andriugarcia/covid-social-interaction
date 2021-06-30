<template lang="pug">
v-card#createGroup(style='position: relative; height: 100%')
  v-toolbar(
    color='text',
    dark,
    flat,
    style='position: absolute; left: 0; right: 0; z-index: 10'
  )
    v-btn(icon, @click='$emit("back")')
      v-icon fas fa-arrow-left
    span Nuevo Grupo
  .pt-12.pa-4(v-if='step == 1')
    v-text-field.mt-6(filled, dense, placeholder='Buscar Contactos')
    v-layout(wrap)
      v-chip.mr-2.pl-1.pr-2(
        v-for='(participant, i) in people',
        :key='i',
        v-if='!!participant.selected',
        @click='participant.selected = false; count--',
        color='primary',
        dark
      )
        v-avatar(color='white')
          v-img(:src='participant.profile_picture')
        span.ml-1 {{ participant.username }}
        v-icon.ml-2(small, color='white') fas fa-times-circle
    v-list
      v-list-item(
        v-for='(participant, i) in people',
        :key='i',
        @click='selectParticipant(i)'
      )
        v-list-item-avatar(color='primary')
          v-img(:src='participant.profile_picture')
        v-list-item-content
          v-list-item-title {{ participant.username }}
        v-list-item-action
          v-avatar(
            v-if='!!participant.selected',
            color='primary',
            dark,
            size='32'
          )
            v-icon.white--text(small) fas fa-check
  .pt-12.pa-4(v-else-if='step == 2', style='overflow-y: scroll; height: 100%')
    v-layout.py-6(align-center)
      avatar-input(@update='updateCover')
      v-text-field(
        placeholder='Nombre del grupo',
        autofocus,
        v-model='group.title'
      )
    .overline DESCRIPCIÓN
    v-textarea(
      placeholder='Descripción del grupo',
      autogrow,
      :rows='1',
      v-model='group.description'
    )
    .overline UBICACIÓN (opcional)
    p La Ubicación hará visible el grupo a las personas que estén cerca
    v-dialog(
      v-model='locationSelectorOpened',
      fullscreen,
      hide-overlay,
      transition='dialog-bottom-transition'
    )
      template(v-slot:activator='{ on, attrs }')
        v-text-field(
          label='Ubicación',
          :value='group.coordinates != null ? group.coordinates.lat.toFixed(4) + ". " + group.coordinates.lng.toFixed(4) : ""',
          v-on='on',
          readonly,
          append-icon='fas fa-map-marker-alt'
        )
      v-card
        location-select(
          :initialPosition='{ lng: -3.612036640743373, lat: 37.17319576390279 }',
          @updated='updateLocation',
          @back='locationSelectorOpened = false'
        )
    .overline CANAL
    v-checkbox(label='Es un canal')
    v-layout(justify-start)
      v-icon.mr-2 fas fa-info-circle
      p Los canales permiten comunicarnos con los miembros sin que ellos puedan contestar
    v-layout(justify-space-between)
      .overline MIEMBROS
      v-chip {{ count }}
    v-list
      v-list-item(v-for='(participant, i) in members', :key='i')
        v-list-item-avatar(color='primary')
          v-img(:src='participant.profile_picture')
        v-list-item-content
          v-list-item-title {{ participant.username }}
  v-btn(
    v-if='step == 1',
    fab,
    large,
    dark,
    color='primary',
    style='position: absolute; bottom: 16px; right: 8px',
    :disabled='count == 0',
    @click='nextStep'
  )
    v-icon fas fa-arrow-right
  v-btn(
    v-if='step == 2',
    fab,
    large,
    dark,
    color='primary',
    style='position: absolute; bottom: 16px; right: 8px',
    :disabled='!group.title || !group.cover',
    @click='createGroup'
  )
    v-icon fas fa-check
</template>

<script>
import avatarInput from '@/components/avatar-input'
export default {
  components: {
    avatarInput,
    locationSelect: () => import('@/components/map/locationSelect'),
  },
  data() {
    return {
      step: 1,
      people: [],
      count: 0,
      members: [],
      locationSelectorOpened: false,
      group: {
        type: 'group',
        title: '',
        description: '',
        cover: '',
        coordinates: null,
      },
    }
  },
  async mounted() {
    this.people = (await this.$store.dispatch('user/getPeople')).map(
      (user) => ({
        ...user,
        selected: false,
      })
    )
  },
  methods: {
    selectParticipant(index) {
      if (this.people[index].selected) {
        this.people[index].selected = false
        this.count--
      } else {
        this.people[index].selected = true
        this.count++
      }
    },
    nextStep() {
      this.members = this.people.filter((user) => user.selected)
      this.step++
    },
    updateLocation(coordinates) {
      this.group.coordinates = coordinates
    },
    updateCover(src) {
      this.group.cover = src
    },
    async createGroup() {
      const chat_id = await this.$store.dispatch('chat/createGroup', {
        ...this.group,
        username: this.$store.state.auth.user.username,
        members: this.members.map((user) => user.profile_id),
      })
      this.$router.push({ path: `/group/${chat_id}` })
    },
  },
}
</script>
