<template lang="pug">
  #chat(style="width: 100%; height: 100%;")
    v-toolbar(flat, color="text", style="position: fixed; top: 0; left: 0; right: 0; z-index: 10;")
      //- v-icon.mr-4(color="primary") fas fa-street-view
      v-avatar(color="primary")
        v-img(:src="chat.cover")
      .ml-2.background--text.font-weight-bold {{ chat.title }}
    v-sheet(color="white")
      messages(v-if="chatLoaded")
    div(style="position: fixed; bottom: -16px; left: 0; right: 0;")
      chat-bar(:chat="chat")
  
</template>

<script>
import messages from '@/components/chat/messages'
import chatBar from '@/components/chat/chatBar'

export default {
  components: {
    messages,
    chatBar,
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('chat/closeChat')
    next()
  },
  data() {
    return {
      chatLoaded: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    chat() {
      return this.$store.state.chat.chat
    },
  },
  async mounted() {
    await this.$store.dispatch('chat/getGroup', this.$route.params.group)
    this.chatLoaded = true
  },
}
</script>
