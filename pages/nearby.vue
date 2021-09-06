<template lang="pug">
#chat(style='position: relative; width: 100%; height: 100%')
  v-toolbar(
    flat,
    color='text',
    style='position: absolute; top: 0; left: 0; right: 0; z-index: 10'
  )
    v-icon.mr-4(color='primary') fas fa-street-view
    .white--text
      .font-weight-bold Close to you
      span(v-if='participants') {{ participants }} personas cerca
  v-sheet(
    color='white',
    style='padding-top: 52px; height: 100vh; overflow-y: none; overflow-x: hidden'
  )
    messages(nearby)
  div(style='position: absolute; bottom: 0px; left: 0; right: 0')
    chat-bar(nearby)
</template>

<script>
import messages from '@/components/chat/messages'
import chatBar from '@/components/chat/chatBar'

export default {
  head: {
    title: 'Cerca de ti | Olimaps',
  },
  components: {
    messages,
    chatBar,
  },
  computed: {
    user() {
      if (!this.$store.getters['auth/authenticated'])
        this.$router.replace({ path: '/' })
      return this.$store.state.auth.user
    },
    participants() {
      if (this.$store.state.chat.nearbyMessages.length > 0) {
        return this.$store.state.chat.nearbyMessages[
          this.$store.state.chat.nearbyMessages.length - 1
        ].neighbours
      } else {
        return null
      }
    },
  },
  mounted() {
    this.$store.commit('chat/readNearby')
  },
}
</script>
