<template lang="pug">
  #messages.px-4(ref="chat", style="padding-top: 100px; height: 100vh; overflow-y: scroll; padding-bottom: 82px;")
    div(v-for="(message, i) in messages", :key="i")
      v-layout.my-4(justify-center)
        v-chip.font-weight-bold(v-if="i == 0 || !hasSameDay(messages[i-1], message)", color="blue-grey lighten-3") {{ message.created_at | toDate }}
      v-layout.my-2(align-end, :justify-end="isMe(message.author)")
        div(v-if="!isMe(message.author)", style="width: 60px;")
          v-avatar(v-if="(i + 1) >= messages.length || messages[i + 1].author != message.author", color="primary", @click="$router.push({ path: '/' + message.author })")
            v-img(:src="message.profile.profile_picture")
        v-card.pa-4.rounded-xl(flat, :color="isMe(message.author) ? 'secondary' :'background'", style="min-width: 200px; max-width: 80vw") 
          v-layout(v-if="!isMe(message.author) && ((i - 1) < 0 || messages[i - 1].author != message.author)", justify-space-between, align-center)
            .font-weight-bold.text-capitalize {{ message.profile.username }}
            //- .font-italic 500m
          img.ma-1.rounded-xl.mb-4.imageMessage(v-if="message.type == 'image'", :src="message.src", @click="openImage(message.src)", style="width: 100%")
          post.my-2(v-if="message.type == 'post'", :content="{...message.post, profile: message.profile}")
          audio-player(v-if="message.type == 'audio'", :src="message.src")
          p {{message.text}}
          v-layout(justify-end, align-end)
            .mx-2.font-weight-bold(style="font-size: .8em;") {{ message.created_at | toHour }}
    v-dialog(v-model="imageOpened")
      v-btn(@click="imageOpened = false", dark, icon, style="position: absolute; top: 12px; right: 12px")
        v-icon fas fa-times
      v-img(v-if="imageOpened", :src="imageSrc", style="width: 100%")
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
      imageOpened: '',
      imageSrc: '',
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
  watch: {
    imageOpened(value) {
      if (!value) {
        this.$router.replace({ hash: '' })
      }
    },
    $route(route) {
      if (route.hash === '') {
        this.imageOpened = false
        this.imageSrc = ''
      }
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
    hasSameDay(first, second) {
      const secondsToDaysDivisor = 86400000
      const firstDate = new Date(first.created_at)
      const secondDate = new Date(second.created_at)
      return (
        Math.floor(firstDate.getTime() / secondsToDaysDivisor) ===
        Math.floor(secondDate.getTime() / secondsToDaysDivisor)
      )
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
    openImage(src) {
      this.imageOpened = true
      this.imageSrc = src
      this.$router.push({ hash: 'image' })
    },
  },
}
</script>
