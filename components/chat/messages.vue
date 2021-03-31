<template lang="pug">
  #messages.pt-12.px-4(ref="chat", style="height: 100vh; overflow-y: scroll; padding-bottom: 82px;")
    v-layout.my-2(v-for="(message, i) in messages", :key="i", align-end, :justify-end="isMe(message.author)")
      div(v-if="!isMe(message.author)", style="width: 60px;")
        v-avatar(v-if="(i + 1) >= messages.length || messages[i + 1].author != message.author", color="primary")
          v-img(:src="message.profile.profile_picture")
      v-card.pa-4.rounded-xl(flat, :color="isMe(message.author) ? 'secondary' :'background'", style="min-width: 200px") 
        v-layout(v-if="!isMe(message.author) && ((i - 1) < 0 || messages[i - 1].author != message.author)", justify-space-between, align-center)
          .font-weight-bold.text-capitalize {{ message.profile.username }}
          //- .font-italic 500m
        img.ma-1.rounded-xl.mb-4.imageMessage(v-if="message.type == 'image'", :src="message.src", style="width: 100%")
        post(v-if="message.type == 'post'", :content="message.post")
        audio-player(v-if="message.type == 'audio'", :src="message.src")
        p {{message.text}}
        v-layout(justify-end, align-end)
          .mx-2.font-weight-bold(style="font-size: .8em;") {{ message.created_at | toHour }}
</template>

<script>
import audioPlayer from '@/components/chat/audioPlayer'
import camera from '@/components/editor/camera'
import post from '@/components/chat/post'
import date from '@/mixins/date'

export default {
  components: {
    audioPlayer,
    camera,
    post,
  },
  mixins: [date],
  data() {
    return {
      loadingMessages: false,
    }
  },
  computed: {
    messages() {
      return this.$store.state.chat.messages
    },
    chat() {
      return this.$store.state.chat.chat
    },
    allMessagesLoaded() {
      return this.$store.state.chat.allMessagesLoaded
    },
  },
  mounted() {
    const self = this
    setTimeout(() => {
      self.$refs.chat.scrollTop = self.$refs.chat.scrollHeight
      self.$refs.chat.addEventListener('scroll', this.handleScroll)
    }, 0)
  },
  methods: {
    isMe(userId) {
      return this.$store.state.auth.user.profile_id === userId
    },
    async handleScroll() {
      if (
        !this.allMessagesLoaded &&
        this.$refs.chat.scrollTop < 100 &&
        !this.loadingMessages
      ) {
        this.loadingMessages = true
        const bottomScroll =
          this.$refs.chat.scrollHeight - this.$refs.chat.scrollTop
        await this.$store.dispatch('chat/getMessages', {
          chatId: this.chat.chat_id,
        })
        setTimeout(() => {
          this.$refs.chat.scrollTop =
            this.$refs.chat.scrollHeight - bottomScroll
        }, 0)
        this.loadingMessages = false
      }
    },
  },
}
</script>
