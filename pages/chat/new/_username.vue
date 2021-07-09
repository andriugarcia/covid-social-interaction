<template lang="pug">
#chat(v-if='member', style='position: relative; width: 100%; height: 100%')
  v-toolbar(
    flat,
    color='text',
    style='position: absolute; top: 0; left: 0; right: 0; z-index: 10'
  )
    v-btn.mr-2(icon, dark, small, @click='$router.replace({ path: "/chat" })')
      v-icon fas fa-chevron-left
    v-avatar(
      @click='$router.push({ path: "/" + member.username })',
      color='primary'
    )
      v-img(:src='member.profile_picture')
    .ml-2.background--text.font-weight-bold(
      @click='$router.push({ path: "/" + member.username })'
    ) {{ member.username }}
    v-spacer
  v-sheet.pt-12(color='white', style='height: 100%')
    v-layout.pt-12(column, align-center)
      v-avatar(size='80', color='primary')
        v-img(:src='member.profile_picture')
      .font-weight-bold {{ member.username }}
      span {{ member.followers }} seguidores
  div(style='position: absolute; bottom: 0px; left: 0; right: 0')
    chat-bar(:username='member.username')
</template>

<script>
import chatBar from '@/components/chat/chatBar'

export default {
  data() {
    return {
      member: null,
    }
  },
  components: {
    chatBar,
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },

  mounted() {
    this.getUser()
  },

  methods: {
    async getUser() {
      this.member = await this.$store.dispatch(
        'user/getUser',
        this.$route.params.username
      )
    },
  },
}
</script>
