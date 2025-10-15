<template lang="pug">
v-card(style='min-height: 600px; height: 100%', color='white')
  v-toolbar(color='primary', dark)
    v-btn(icon, @click='$emit("back")')
      v-icon fas fa-arrow-left
    v-toolbar-title New Member
    v-spacer
    v-btn(text, :disabled='count == 0', @click='addParticipants') Add
  v-list(color='white')
    v-list-item(
      v-for='(participant, i) in people',
      :key='i',
      @click='selectParticipant(i)'
    )
      v-list-item-avatar(color='primary')
        v-img(:src='participant.profile_picture')
      v-list-item-content
        v-list-item-title {{ participant.username }}
        v-list-item-subtitle(v-if='participant.added') Already in the group
      v-list-item-action
        v-avatar(
          v-if='participant.added || !!participant.selected',
          :color='participant.added ? "grey" : "primary"',
          dark,
          size='32'
        )
          v-icon.white--text(small) fas fa-check
</template>

<script>
export default {
  data() {
    return {
      people: null,
      count: 0,
    }
  },
  async mounted() {
    this.people = (await this.$store.dispatch('user/getPeople')).map(
      (user) => ({
        ...user,
        selected: false,
        added:
          this.$store.state.chat.chat.member.findIndex(
            (member) => member.profile.profile_id === user.profile_id
          ) !== -1,
      })
    )
  },
  methods: {
    selectParticipant(index) {
      if (this.people[index].added) return
      if (this.people[index].selected) {
        this.people[index].selected = false
        this.count--
      } else {
        this.people[index].selected = true
        this.count++
      }
    },
    async addParticipants() {
      const participants = this.people.reduce(function (filtered, participant) {
        if (participant.selected) {
          filtered.push(participant.profile_id)
        }
        return filtered
      }, [])
      await this.$store.dispatch('chat/addParticipants', participants)
      this.$emit('back')
    },
  },
}
</script>