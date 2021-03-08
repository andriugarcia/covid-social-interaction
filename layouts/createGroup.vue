<template lang="pug">
  v-card#createGroup
    v-toolbar(color="text", dark)
      v-btn(icon)
        v-icon fas fa-arrow-left
      span Nuevo Grupo
    .pa-4(v-if="step == 1")
      v-text-field(filled, dense, placeholder="Buscar Contactos")
      v-layout(wrap)
        v-chip.pl-1.pr-2(v-for="(participant, i) in people", :key="i", v-if="!!participant.selected", @click="participant.selected = false; count--", color="primary", dark)
          v-avatar(color="white")
            v-img(:src="participant.profilePicture")
          span.ml-1 {{ participant.username }}
          v-icon.ml-2(small, color="white") fas fa-times-circle
      v-list
        v-list-item(v-for="(participant, i) in people", :key="i", @click="selectParticipant(i)")
          v-list-item-avatar(color="primary")
            v-img(:src="participant.profilePicture")
          v-list-item-content
            v-list-item-title {{ participant.username }}
          v-list-item-action
            v-avatar(v-if="!!participant.selected", color="primary", dark, size="32")
              v-icon.white--text(small) fas fa-check
    .pa-4(v-else-if="step == 2")
      v-layout.pb-6(align-center)
        avatar-input(@update="updateCover")
        v-text-field(placeholder="Nombre del grupo", autofocus, v-model="group.title")
      .overline DESCRIPCIÓN
      v-textarea(placeholder="Descripción del grupo", autogrow, :rows="1", v-model="group.description")
      .overline CANAL
      v-checkbox(label="Es un canal")
      v-layout(justify-start)
        v-icon.mr-2 fas fa-info-circle
        p Los canales permiten comunicarnos con los miembros sin que ellos puedan contestar
      v-layout(justify-space-between)
        .overline MIEMBROS
        v-chip {{ count }}
      v-list
        v-list-item(v-for="(participant, i) in members", :key="i")
          v-list-item-avatar(color="primary")
            v-img(:src="participant.profilePicture")
          v-list-item-content
            v-list-item-title {{ participant.username }}
    v-btn(v-if="step == 1", fab, large, dark, fixed, right, bottom, color="primary", :disabled="count == 0", @click="nextStep")
      v-icon fas fa-arrow-right
    v-btn(v-if="step == 2", fab, large, dark, fixed, right, bottom, color="primary", :disabled="!group.title || !group.cover", @click="createGroup")
      v-icon fas fa-check
</template>

<script>
import avatarInput from '@/components/avatar-input'
export default {
  components: {
    avatarInput,
  },
  data() {
    return {
      step: 1,
      people: [],
      count: 0,
      members: [],
      group: {
        type: 'group',
        title: '',
        description: '',
        cover: '',
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
    updateCover(src) {
      this.group.cover = src
    },
    createGroup() {
      this.$store.dispatch('chat/createGroup', {
        ...this.group,
        username: this.$store.state.auth.user.username,
        members: this.members.map((user) => user.email),
      })
    },
  },
}
</script>
