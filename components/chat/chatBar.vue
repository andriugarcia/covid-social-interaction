<template lang="pug">
#chatBar.pb-2
  v-card.mb-2.ml-4.rounded-xl(
    v-if='message.src && (message.type == "image" || message.type == "video")',
    flat,
    color='primary',
    :class='{ "pa-1": false, "pa-3": true }',
    style='position: relative; width: fit-content'
  )
    img.rounded-xl(
      v-if='message.type == "image"',
      :src='message.src',
      :class='{ blured: uploading }',
      style='max-width: 300px; max-height: 400px'
    )
    video.rounded-xl(
      v-else-if='message.type == "video"',
      preload='metadata',
      :src='message.src',
      :controls='!loading',
      style='width: 100%; height: 100%; max-height: 400px; object-fit: contain',
      :class='{ blured: uploading }'
    )
    v-row.fill-height.ma-0(
      v-if='uploading',
      align='center',
      justify='center',
      style='position: absolute; top: 0px; right: 0px; left: 0; bottom: 0'
    )
      v-progress-circular(indeterminate, color='grey lighten-5')
  v-layout.px-2(align-end)
    v-card.py-2.px-3.mr-1.rounded-xl(
      v-if='!recording',
      style='width: 100%',
      outlined
    )
      v-layout(align-end, justify-center)
        v-btn.mb-1(v-if='!message.src', icon, depressed, small)
          v-icon fas fa-camera
          input(
            type='file',
            @change='imageUpdated',
            accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm',
            capture='camera',
            style='opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0'
          )
        v-btn(
          v-else,
          fab,
          depressed,
          small,
          color='primary',
          @click='removeImage'
        )
          v-icon(small) fas fa-trash
        texteditor(
          v-model='message.text',
          top,
          placeholder='Write your message...',
          style='max-height: 30vh; overflow-y: auto; margin-bottom: 8px',
          size='0.9em',
          @enter='sendMessage'
        )
        v-menu(top, offset-y, rounded)
          template(v-slot:activator='{ on }')
            v-btn(icon, v-on='on')
              v-icon fas fa-paperclip
          v-card.pa-1(outlined)
            v-layout(wrap)
              v-card.rounded-xl.pa-3.ma-1.mx-1(flat, outlined)
                v-avatar(color='primary', dark)
                  v-icon.white--text fas fa-image
                .mt-1 Media
                input(
                  type='file',
                  @change='imageUpdated',
                  accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm',
                  style='opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0'
                )
              v-card.rounded-xl.pa-3.ma-1.mx-1(
                flat,
                @click='shareEvent = true',
                outlined
              )
                v-avatar(color='primary', dark)
                  v-icon.white--text fas fa-flag
                .mt-1 Event
              v-card.rounded-xl.pa-3.ma-1.mx-1(
                flat,
                @click='shareGroup = true',
                outlined
              )
                v-avatar(color='primary', dark)
                  v-icon.white--text fas fa-user
                .mt-1 Group
    //- v-text-field(v-model="message.text", solo, hide-details, rounded, outlined, @click:prepend-inner="cameraToggle = true", @keydown.enter="sendMessage", placeholder="Escribe un mensaje", color="primary", append-icon="")
      template(#prepend-inner)
        v-btn(v-if="!message.src", icon, depressed, small)
          v-icon fas fa-camera
          input(type="file", @change="imageUpdated", accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm", capture="camera", style="opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0;")
        v-btn(v-else, fab, depressed, small, color="primary", @click="removeImage")
          v-icon(small) fas fa-trash
      template(#append)
        v-menu(top, offset-y)
          template(v-slot:activator="{on}")
            v-btn(icon, v-on="on")
              v-icon fas fa-paperclip
          v-card.rounded-xl.pa-4
            v-layout(wrap)
              v-sheet.pa-1.ma-1(flat, @click="")
                v-avatar(color="yellow")
                  v-icon.black--text fas fa-flag
                .mt-1 Evento
              v-sheet.pa-1.ma-1(flat, @click="shareGroup = true")
                v-avatar(color="yellow")
                  v-icon.black--text fas fa-user
                .mt-1 Grupo
    audio-input(
      v-if='message.text.length == 0 && !message.src',
      @update='audioUpdated',
      @recordstart='recording = true',
      @recordstop='recording = false',
      left,
      dark,
      :style='recording ? "width: 100%" : ""'
    )
    v-btn(v-else, fab, depressed, color='primary', @click='sendMessage')
      v-icon fas fa-paper-plane
  v-dialog(
    v-model='shareEvent',
    :fullscreen='!$vuetify.breakpoint.mdAndUp',
    :width='500'
  )
    v-card(style='min-height: 600px; height: 100%', color='white')
      v-toolbar(color='primary', dark) 
        v-btn(icon, @click='shareEvent = false')
          v-icon fas fa-arrow-left
        v-toolbar-title Share Event
      .pa-2(v-if='user.participation.length > 0')
        event.mb-2(
          v-for='(event, i) in user.participation',
          :key='i',
          :event='event.event',
          readonly,
          @click.native='sendEvent(event)'
        )
      v-card.ma-2.rounded-xl.pa-4(v-else, outlined) No scheduled events

  v-dialog(
    v-model='shareGroup',
    :fullscreen='!$vuetify.breakpoint.mdAndUp',
    :width='500'
  )
    v-card(style='min-height: 600px; height: 100%', color='white')
      v-toolbar(color='primary', dark) 
        v-btn(icon, @click='shareGroup = false')
          v-icon fas fa-arrow-left
        v-toolbar-title Share Group
      v-list(color='white')
        v-list-item(
          v-for='(group, i) in groups',
          :key='i',
          @click='sendGroup(group)'
        )
          v-list-item-avatar
            v-img(:src='group.chat.cover')
          v-list-item-content {{ group.chat.title }}
</template>

<script>
import audioInput from '@/components/editor/audioInput'
import texteditor from '@/components/editor/textarea'

export default {
  components: {
    audioInput,
    texteditor,
    camera: () => import('@/components/editor/camera'),
    event: () => import('@/components/event/item'),
  },
  props: {
    // Si username existe se crea el chat
    userId: {
      type: String,
      default: null,
    },
    chat: {
      type: Object,
      default: () => ({}),
    },
    nearby: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    groups() {
      return this.$store.state.chat.chats.filter(
        (chat) => chat.chat.type === 'group'
      )
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  data() {
    return {
      message: {
        src: '',
        text: '',
        type: 'text',
      },
      recording: false,
      uploading: false,
      shareGroup: false,
      shareEvent: false,
    }
  },
  methods: {
    async sendMessage() {
      if (this.nearby) {
        await this.$store.dispatch('chat/createNearbyMessage', this.message)
      } else if (this.userId) {
        this.message.userId = this.userId

        const chat_id = await this.$store.dispatch(
          'chat/createMessage',
          this.message
        )
        this.$router.push('/chat/' + chat_id)
      } else {
        this.message.chatId = this.chat.chat_id
        await this.$store.dispatch('chat/createMessage', this.message)
      }
      this.removeImage()
      this.message.text = ''
      this.$emit('messageSended')
    },
    async sendGroup({ chat }) {
      this.message = {
        src: null,
        text: '',
        type: 'chat',
        chat_ref: chat.chat_id,
        chat,
      }
      await this.sendMessage()
    },
    async sendEvent({ event }) {
      await this.$store.dispatch('event/share', {
        event: event.event_id,
        targets: [this.chat.chat_id],
      })
      this.$store.commit('chat/pushMessage', {
        src: null,
        text: '',
        type: 'event',
        event_ref: event.event_id,
        event: event,
        author: this.user.profile_id,
        created_at: Date.now(),
      })
      this.shareEvent = false
    },
    async imageUpdated(ev) {
      const file = ev.target.files[0]
      this.uploading = true

      let data
      this.previewImage(file)
      if (file.type.startsWith('image')) {
        this.message.type = 'image'

        data = await this.$store.dispatch('storage/uploadFile', file)
      } else if (file.type.startsWith('video')) {
        this.message.type = 'video'

        data = await this.$store.dispatch('storage/uploadVideo', file)
      }

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
  filter: blur(2px);
  margin: -10px;
}
</style>
