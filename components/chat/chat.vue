<template lang="pug">
  #chat(style="width: 100%; height: 100%;")
    v-toolbar(flat, color="text", style="position: fixed; top: 0; left: 0; right: 0; z-index: 10;")
      //- v-icon.mr-4(color="primary") fas fa-street-view
      v-avatar(color="primary")
        v-img(:src="chat.user.profilePicture")
      .ml-2.background--text.font-weight-bold {{ chat.user.username }}
    v-card.pt-12.px-4(flat, color="white", style="height: 100%; padding-bottom: 82px;")
      v-layout.my-2(v-for="(message, i) in messages", :key="i", align-end, :justify-end="message.author.email == user._id")
        div(v-if="message.author.email != user._id", style="width: 60px;")
          v-avatar(v-if="(i + 1) >= messages.length || messages[i + 1].author.username != message.author.username", color="primary")
            v-img(:src="message.author.profilePicture")
        v-card.pa-4.rounded-xl(flat, :color="message.author.email == user._id ? 'secondary' :'background'", style="min-width: 200px") 
          v-layout(v-if="message.author.email != user._id && ((i - 1) < 0 || messages[i - 1].author.username != message.author.username)", justify-space-between, align-center)
            .font-weight-bold {{message.author.username}}
            //- .font-italic 500m
          img.ma-1.rounded-xl.imageMessage(v-if="message.type == 'image'", :src="message.src")
          audio-player(v-if="message.type == 'audio'", :src="message.src")
          p {{message.text}}
          v-layout(justify-end, align-end)
            .mx-2.font-weight-bold(style="font-size: .8em;") {{ message.createdat | toHour }}
      //- v-layout.my-2(v-for="(message, i) in chat", :key="i", align-end, :justify-end="message.author == user._id")
        div(v-if="message.author != user._id", style="width: 60px")
          v-avatar(v-if="(i + 1) >= chat.length || messages[i + 1].author.username != message.author.username")
            v-img(:src="message.profilePicture")
        v-card.ml-4.pa-3.rounded-lg(flat, :color="message.author == user._id ? 'primary' :'#e0e0e0'") 
          v-layout(justify-space-between, align-end)
            div
              .font-weight-bold(v-if="message.author != user._id && ((i - 1) < 0 || messages[i - 1].author.username != message.author.username)") {{message.author.username}}
              p.mb-0 {{message.text}}
            .ml-2.font-weight-bold(style="font-size: .8em") {{ message.createdat | toHour }},
    div(style="position: fixed; bottom: -16px; left: 0; right: 0;")
      v-card.pa-1.mb-2.ml-4.rounded-xl(v-if="message.src && message.type == 'image'", flat, color="primary", style="position: relative; width: 300px;")
        .rounded-xl(style="overflow: hidden")
          v-img.rounded-xl(:src="message.src", width="300", max-height="200", :class="{'blured': uploading}")
        v-row.fill-height.ma-0(v-if="uploading" ,align="center", justify="center", style="position: absolute; top: 0px; right: 0px; left: 0; bottom: 0;")
          v-progress-circular(indeterminate, color="grey lighten-5")
      v-layout.px-2
        v-text-field(v-model="message.text", solo, rounded, outlined, @click:prepend-inner="cameraToggle = true", @keydown.enter="sendMessage", placeholder="Escribe un mensaje", color="primary", append-icon="")
          template(#prepend-inner)
            v-btn(v-if="!message.src", icon, depressed, small, @click="cameraToggle = true")
              v-icon fas fa-camera
            v-btn(v-else, fab, depressed, small, color="primary", @click="removeImage")
              v-icon(small) fas fa-trash
        audio-input.mx-2(v-if="message.text.length == 0 && !message.src", @update="audioUpdated", left, dark)
        v-btn.mx-1(v-else, fab, color="primary", @click="sendMessage")
          v-icon far fa-paper-plane
    v-dialog(v-model="cameraToggle", fullscreen)
      camera(v-if="cameraToggle", @back="cameraToggle = false", @update="imageUpdated")
  
</template>

<script>
import audioInput from '@/components/editor/audioInput'
import audioPlayer from '@/components/chat/audioPlayer'
import camera from '@/components/editor/camera'

export default {
  filters: {
    toHour(value) {
      const date = new Date(value)
      return (
        date.getHours() +
        ':' +
        (date.getMinutes() < 10 ? '0' : '') +
        date.getMinutes()
      )
    },
  },
  props: {
    chat: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    audioInput,
    audioPlayer,
    camera,
  },
  data() {
    return {
      uploading: false,
      cameraToggle: false,
      messages: [],
      message: {
        chatId: '',
        src: '',
        text: '',
        type: 'text',
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  async mounted() {
    this.messages = await this.$store.dispatch(
      'chat/getMessages',
      this.chat.chatid
    )
  },
  methods: {
    async sendMessage() {
      this.message.chatId = this.chat.chatid

      await this.$store.dispatch('chat/createMessage', this.message)
      this.removeImage()
      this.message.text = ''
    },
    async imageUpdated(image) {
      this.uploading = true
      this.message.type = 'image'

      this.previewImage(image)

      const data = await this.$store.dispatch('storage/uploadFile', image)
      this.message.src = data.location
      this.uploading = false
    },
    async audioUpdated(audioBlob) {
      this.message.type = 'audio'

      const { location } = await this.$store.dispatch(
        'storage/uploadAudio',
        audioBlob
      )
      this.message.src = location
      this.sendMessage()
    },
    previewImage(image) {
      const reader = new FileReader()

      const self = this
      reader.onload = function (e) {
        self.message.src = e.target.result
      }

      reader.readAsDataURL(image)
    },
    removeImage() {
      this.message.type = 'text'
      this.message.src = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.imageMessage {
  display: block;
  max-width: 320px;
  max-height: 280px;
  width: auto;
  height: auto;
}
.blured {
  filter: blur(4px);
  margin: -4%;
}
</style>
