<template lang="pug">
#createGroup(style='position: relative; inset: 0')
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
    v-text-field.mt-6(filled, dense, placeholder='Buscar Contactos')
    v-list(color='white')
      v-list-item(
        v-for='(follower, i) in followers',
        :key='i',
        @click='openChat(follower.target)'
      )
        v-list-item-avatar(color='primary')
          v-img(:src='follower.profile.profile_picture')
        v-list-item-content
          v-list-item-title {{ follower.profile.username }}
        v-dialog(
          :value='sendMessage',
          fullscreen,
          transition='fade-transition'
        )
          v-sheet(
            color='#1e1e1eE0',
            style='position: relative; width: 100%; height: 100%'
          )
            v-layout(justify-center)
              new-chat(
                v-if='sendMessage',
                :user='follower.profile',
                @back='sendMessage = false',
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
    }
  },
  async mounted() {
    this.followers = await this.$store.dispatch('user/getFollowers')
  },
  methods: {
    openChat(profile_id) {
      const chatId =
        this.$store.getters['chat/getChatIdFromUsername'](profile_id)

      if (chatId !== null) {
        this.$router.push({ path: `chat/${chatId}` })
      } else {
        this.sendMessage = true
      }
    },
  },
}
</script>
