<template lang="pug">
v-card.rounded-lg
  v-toolbar(color='primary', dark, dense)
    v-toolbar-title Seguir Usuarios
    v-spacer
    v-btn(icon)
      v-icon fas fa-times
  v-list(style='max-height: 600px; overflow-y: scroll')
    v-list-item(v-for='(contact, i) in contacts', :key='i')
      v-list-item-avatar(color='primary')
        v-img(:src='contact.profile_picture')
      v-list-item-content
        v-list-item-title {{ contact.username }}
      v-list-item-action
        v-btn(
          rounded,
          small,
          depressed,
          :outlined='!contact.follow',
          color='primary',
          @click='follow(contact)'
        ) {{ contact.follow ? "Siguiendo" : "Seguir" }}
</template>

<script>
export default {
  computed: {
    contacts() {
      return this.$store.state.user.rrssContacts
    },
  },
  methods: {
    follow(user) {
      if (user.follow) {
        this.$store.dispatch('user/unfollow', user.profile_id)
        user.follow = false
      } else {
        this.$store.dispatch('user/follow', user.profile_id)
        user.follow = true
      }
    },
  },
}
</script>