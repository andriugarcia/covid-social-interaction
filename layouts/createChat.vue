<template lang="pug">
#createGroup(style='position: relative; width: 100%; inset: 0')
  v-toolbar(
    color='primary',
    dark,
    flat,
    style='position: absolute; top: 0; left: 0; right: 0; z-index: 10'
  )
    v-btn(icon, @click='$emit("back")')
      v-icon fas fa-arrow-left
    span Nuevo Chat
  v-sheet.pt-12.pa-4(color='white', style='height: 100vh; overflow-y: scroll')
    v-text-field.mt-6(
      v-model='textFilter',
      filled,
      dense,
      placeholder='Buscar Contactos'
    )
    v-list(color='white')
      v-list-item(
        v-for='(follower, i) in followersFiltered',
        :key='i',
        @click='openChat(i)'
      )
        v-list-item-avatar(color='primary')
          v-img(:src='follower.profile.profile_picture')
        v-list-item-content
          v-list-item-title {{ follower.profile.username }}
  v-dialog(v-model='sendMessage', fullscreen, transition='fade-transition')
    v-sheet(
      color='#1e1e1eE0',
      style='position: relative; width: 100%; height: 100%'
    )
      v-layout(justify-center)
        new-chat(
          v-if='sendMessage',
          :user='userSelected',
          @back='closeChat',
          style='max-width: 600px'
        )
</template>

<script>
export default {
  components: {
    NewChat: () => import('@/layouts/newChat'),
  },
  data() {
    return {
      followers: [],
      sendMessage: false,
      textFilter: '',
      userSelected: null,
    }
  },
  async mounted() {
    this.followers = await this.$store.dispatch('user/getFollowers')
  },
  computed: {
    followersFiltered() {
      if (this.textFilter.length === 0) {
        return [...this.followers]
      }
      const ff = this.followers.filter((follower) => {
        const name = follower.profile.username

        return name.toLowerCase().includes(this.textFilter.toLowerCase())
      })

      return ff
    },
  },
  methods: {
    closeChat() {
      this.sendMessage = false
      this.userSelected = null
    },
    openChat(i) {
      const username = this.followersFiltered[i].profile.username
      const chatId = this.$store.getters['chat/getChatIdFromUsername'](username)

      if (chatId !== null) {
        this.$router.push({ path: `chat/${chatId}` })
      } else {
        this.sendMessage = true
        this.userSelected = this.followersFiltered[i].profile
      }
    },
  },
}
</script>
