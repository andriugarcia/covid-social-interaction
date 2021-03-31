<template lang="pug">
  #chat(style="width: 100%; height: 100%;")
    v-toolbar(flat, color="text", style="position: fixed; top: 0; left: 0; right: 0; z-index: 10;")
      //- v-icon.mr-4(color="primary") fas fa-street-view
      v-avatar(color="primary")
        v-img(:src="chat.cover")
      .ml-2.background--text.font-weight-bold {{ chat.title }}
    v-sheet(color="white")
      messages(v-if="chatLoaded")
    div(style="position: fixed; bottom: 0px; left: 0; right: 0;")
      v-btn(block, tile, large, color="primary", @click="joinChat") UNIRME
  
</template>

<script>
import messages from '@/components/chat/messages'

export default {
  components: {
    messages,
  },
  beforeRouteLeave(_, __, next) {
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

    if (this.isParticipant()) {
      this.$router.push({ path: `/group/${this.chat.chat_id}` })
    }
  },
  methods: {
    async joinChat() {
      await this.$store.dispatch('chat/joinChat', this.$route.params.group)
      this.$router.replace({ path: `/group/${this.$route.params.group}` })
    },
    isParticipant() {
      console.log(this.chat)
      const index = this.chat.member.findIndex(
        (participant) => participant.profile_id === this.user.profile_id
      )
      return index !== -1
    },
  },
}
</script>
