<template lang="pug">
#chat(v-if='chatLoaded && member', style='position: relative; width: 100%')
  v-toolbar(
    flat,
    color='text',
    style='position: absolute; top: 0; left: 0; right: 0; z-index: 10'
  )
    v-btn.mr-2(icon, dark, small, @click='$router.replace({ path: "/chat" })')
      v-icon fas fa-chevron-left
    v-list-item.px-0.text-capitalize(
      v-if='!loading',
      text,
      dark,
      style='width: 100%'
    )
      v-badge(
        overlap,
        bottom,
        color='primary',
        :value='member.active',
        offset-x='18',
        offset-y='18'
      )
        v-avatar(
          @click='$router.push({ path: "/" + member.username })',
          color='primary'
        )
          v-img(v-if='member.profile_picture', :src='member.profile_picture')
            template(#placeholder)
              v-row.fill-height.ma-0(align='center', justify='center')
                v-progress-circular(indeterminate, color='grey lighten-5')
      .ml-2.background--text.font-weight-bold(
        @click='$router.push({ path: "/" + member.username })'
      ) {{ member.username }}

    .d-flex(v-else)
      v-skeleton-loader(type='avatar')
      v-skeleton-loader.ml-2(type='chip')
    v-spacer
    v-menu(offset-y)
      template(v-slot:activator='{ on }')
        v-btn(icon, dark, v-on='on')
          v-icon fas fa-ellipsis-v
      v-card
        v-list
          v-list-item(v-if='!member.muted', @click='mute')
            v-list-item-avatar
              v-icon fas fa-volume-mute
            v-list-item-content Silenciar Chat
          v-list-item(v-else, @click='unmute')
            v-list-item-avatar
              v-icon fas fa-bell
            v-list-item-content Activar Notificaciones
          v-list-item 
            v-list-item-avatar
              v-icon fas fa-ban
            v-list-item-content Bloquear Usuario
  v-sheet(
    color='white',
    style='padding-top: 52px; height: 100vh; overflow-y: none; overflow-x: hidden'
  )
    v-row#loadBar.my-12.pt-12(
      v-if='loading',
      justify='center',
      align='center',
      size='64'
    )
      v-progress-circular(indeterminate, color='primary')
    messages(v-else)
  div(style='position: absolute; bottom: 0px; left: 0; right: 0')
    chat-bar(:chat='chat')
</template>

<script>
import messages from '@/components/chat/messages'
import chatBar from '@/components/chat/chatBar'

export default {
  components: {
    messages,
    chatBar,
  },
  beforeRouteLeave(_, __, next) {
    this.$store.commit('chat/closeChat')
    next()
  },
  data() {
    return {
      chatLoaded: false,
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    chat() {
      console.log(this.$store.state.chat.chat)
      return this.$store.state.chat.chat
    },
    member() {
      if (!this.chatLoaded) return {}
      if (typeof this.$store.state.chat.chat.member === 'undefined') return null
      if (
        this.$store.state.chat.chat.member[0].profile.profile_id !==
        this.$store.state.auth.user.profile_id
      ) {
        this.$store.state.chat.chat.member[0].profile.muted =
          this.$store.state.chat.chat.member[1].muted
        return this.$store.state.chat.chat.member[0].profile
      } else {
        if (typeof this.$store.state.chat.chat.member[1] == 'undefined')
          return {
            username: 'Usuario eliminado',
            profile_picture: null,
          }
        this.$store.state.chat.chat.member[1].profile.muted =
          this.$store.state.chat.chat.member[0].muted
        return this.$store.state.chat.chat.member[1].profile
      }
    },
  },
  methods: {
    async mute() {
      if (await this.$store.dispatch('chat/muteChat', this.chat.chat_id)) {
        this.chat.muted = true
      }
    },
    async unmute() {
      if (await this.$store.dispatch('chat/unmuteChat', this.chat.chat_id)) {
        this.chat.muted = false
      }
    },
  },
  async mounted() {
    this.loading = true
    try {
      await this.$store.dispatch('chat/getChat', this.$route.params.chat)
    } catch (err) {
      this.$router.go(-1)
    }
    this.chatLoaded = true
    await this.$store.dispatch('chat/getMessages', {
      chatId: this.$store.state.chat.chat.chat_id,
    })
    this.loading = false
  },
}
</script>
