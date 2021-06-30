<template lang="pug">
#messages.px-4(
  ref='chat',
  style='padding-top: 100px; height: 100vh; overflow-y: scroll; overflow-x: hidden; padding-bottom: 82px'
)
  v-layout(justify-center)
    v-sheet.rounded-xl.pa-4(
      v-if='messages.length == 0 && chat.type == "group"',
      color='primary',
      dark
    ) 
      span.mx-2 Esto está muy vacío por aquí
      v-btn.mt-2(small, depressed, rounded, color='white', light, block) Invitar Usuarios
  div(v-for='(message, i) in messages', :key='i')
    v-layout.my-4(justify-center)
      v-chip.font-weight-bold(
        v-if='i == 0 || !hasSameDay(messages[i - 1], message)',
        color='blue-grey lighten-3'
      ) {{ message.created_at | toDate }}
    v-layout.my-2(align-end, :justify-end='isMe(message.author)')
      div(v-if='!isMe(message.author)', style='width: 60px')
        v-avatar(
          v-if='i + 1 >= messages.length || messages[i + 1].author != message.author',
          color='primary',
          @click='$router.push({ path: "/" + message.profile.username })'
        )
          v-img(:src='message.profile.profile_picture')
      v-card.pa-4.rounded-xl(
        flat,
        :color='isMe(message.author) ? "secondary" : "background"',
        style='min-width: 200px; max-width: 80vw'
      ) 
        v-layout(
          v-if='!isMe(message.author) && (i - 1 < 0 || messages[i - 1].author != message.author)',
          justify-space-between,
          align-center
        )
          .font-weight-bold.text-capitalize {{ message.profile.username }}
          //- .font-italic 500m
        img.ma-1.rounded-xl.mb-4.imageMessage(
          v-if='message.type == "image"',
          :src='message.src',
          @click='openImage(message.src)',
          style='width: 100%'
        )
        video.ma-1.rounded-xl.mb-4.imageMessage(
          v-else-if='message.type == "video"',
          preload='metadata',
          controls,
          :src='message.src',
          style='width: 100%'
        )
        post.my-2(
          v-else-if='message.type == "post"',
          :content='{ ...message.post, profile: message.profile }'
        )
        audio-player(v-else-if='message.type == "audio"', :src='message.src')
        v-list-item(
          v-else-if='message.type == "chat"',
          nuxt,
          :to='"/group/" + message.chat.chat_id'
        )
          v-list-item-avatar
            v-img(:src='message.chat.cover')
          v-list-item-content
            v-list-item-title {{ message.chat.title }}
          v-list-item-action
            v-btn(small, rounded, depressed, color='black') 
              .white--text Ver Grupo
        p(v-html='message.text')
        v-layout(justify-end, align-end)
          .mx-2.font-weight-bold(style='font-size: 0.8em') {{ message.created_at | toHour }}
  v-badge(
    overlap,
    :value='!isBottom && newMessages != 0',
    :content='newMessages',
    style='position: absolute; bottom: 82px; right: 16px'
  )
    v-fab-transition
      v-btn(
        v-show='!isBottom',
        fab,
        small,
        depressed,
        color='white darken-1',
        @click='scrollToBottom'
      )
        v-icon(small) fas fa-chevron-down
  viewer(v-model='imageOpened')
    v-layout(
      style='height: 100%; background-color: #000000c0',
      justify-center,
      align-center
    )
      v-btn(
        @click='imageOpened = false',
        depressed,
        color='white',
        fab,
        style='position: absolute; top: 12px; right: 12px'
      )
        v-icon fas fa-times
      v-img(v-if='imageOpened', :src='imageSrc', style='width: 100%')
</template>

<script>
import audioPlayer from '@/components/chat/audioPlayer'
import camera from '@/components/editor/camera'
import post from '@/components/chat/post'
import date from '@/mixins/date'

export default {
  props: {
    nearby: {
      type: Boolean,
      default: false,
    },
  },
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
      isBottom: true,
    }
  },
  computed: {
    messages() {
      if (this.nearby) return this.$store.state.chat.nearbyMessages
      return this.$store.state.chat.messages
    },
    chat() {
      if (this.nearby) return { type: 'nearby' }
      return this.$store.state.chat.chat
    },
    allMessagesLoaded() {
      if (this.nearby) return false
      return this.$store.state.chat.allMessagesLoaded
    },
    newMessages: {
      get() {
        return this.$store.state.chat.newMessages
      },
      set(value) {
        this.$store.state.chat.newMessages = value
      },
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
    isBottom(value) {
      if (value) this.newMessages = 0
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
    scrollToBottom() {
      this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
    },
    async handleScroll() {
      this.isBottom =
        this.$refs.chat.scrollTop > this.$refs.chat.scrollHeight - 1000
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
