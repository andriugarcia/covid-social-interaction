<template lang="pug">
  #chatBar
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

export default {
  components: {
    audioInput,
    camera: () => import('@/components/editor/camera'),
  },
  props: {
    chat: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      message: {
        chatId: '',
        src: '',
        text: '',
        type: 'text',
      },
      uploading: false,
      cameraToggle: false,
    }
  },
  methods: {
    async sendMessage() {
      this.message.chatId = this.chat.chat_id

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
.blured {
  filter: blur(4px);
  margin: -4%;
}
</style>
