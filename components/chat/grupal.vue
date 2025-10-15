<template lang="pug">
  #chat(style="width: 100%; height: 100%;")
    v-toolbar(flat, style="position: sticky; top: 0; left: 0; right: 0; z-index: 10;")
      v-icon.mr-4(color="primary") fas fa-street-view
      div
        .font-weight-bold Close to you
        span 30 personas cerca
    v-card.mb-12.pb-12(flat, color="white")
      v-layout.my-2(v-for="(message, i) in chat", :key="i", align-end, :justify-end="message.username == 'me'")
        div(v-if="message.username != 'me'", style="width: 60px;")
          v-avatar(v-if="(i + 1) >= chat.length || chat[i + 1].username != message.username")
            v-img(:src="message.profilePicture")
        v-card.ml-4.rounded-lg(flat, :color="message.username == 'me' ? 'secondary' :'background'") 
          v-layout.ma-2(v-if="message.username != 'me' && ((i - 1) < 0 || chat[i - 1].username != message.username)", justify-space-between, align-center)
            .font-weight-bold {{message.username}}
            .font-italic 500m
          img.ma-1.rounded-sm.imageMessage(v-if="message.type == 'image'", src="https://images.pexels.com/photos/698907/pexels-photo-698907.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
          v-layout.px-2(v-else-if="message.type == 'audio'")
            v-btn(fab, dark, small)
              v-icon(small) fas fa-play
            v-slider.ml-2.mt-1(v-model="value", step="100", style="width: 200px;")
          v-layout.mb-2(justify-space-between, align-end)
            span.mx-2(v-if="message.type == 'audio'") 0:30
            p.mb-0.mx-2.mt-2(v-else) {{message.text}}
            .mx-2.font-weight-bold(style="font-size: .8em;") {{ message.sendedAt | toHour }},
      //- v-layout.my-2(v-for="(message, i) in chat", :key="i", align-end, :justify-end="message.username == 'me'")
        div(v-if="message.username != 'me'", style="width: 60px")
          v-avatar(v-if="(i + 1) >= chat.length || chat[i + 1].username != message.username")
            v-img(:src="message.profilePicture")
        v-card.ml-4.pa-3.rounded-lg(flat, :color="message.username == 'me' ? 'primary' :'#e0e0e0'") 
          v-layout(justify-space-between, align-end)
            div
              .font-weight-bold(v-if="message.username != 'me' && ((i - 1) < 0 || chat[i - 1].username != message.username)") {{message.username}}
              p.mb-0 {{message.text}}
            .ml-2.font-weight-bold(style="font-size: .8em") {{ message.sendedAt | toHour }},
    v-layout(style="position: absolute bottom: 0 left: 0 right: 0;")
      v-text-field(v-model="messageInput", rounded, solo, outlined, @keydown.enter="send", placeholder="Escribe un mensaje", color="primary", prepend-inner-icon="fas fa-smile", append-icon="mdi-send")
        template(#append)
          v-layout
            v-btn(icon)
              v-icon fas fa-paperclip
            v-btn(icon)
              v-icon fas fa-camera
      v-btn.mt-1.mx-2(icon, large)
        v-icon fas fa-microphone
</template>

<script>
import date from '@/mixins/date'
// Demo mode - use mock socket
const socket = {
  emit: () => {},
  on: () => {},
  disconnect: () => {}
}

export default {
  mixins: [date],
  data: () => ({
    messageInput: '',
    coordinates: [0, 0],
    chat: [
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'audio',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'image',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'me',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'image',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'image',
        sendedAt: 1612099800,
      },
      {
        username: 'me',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'me',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'image',
        sendedAt: 1612523408,
      },
      {
        username: 'me',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'image',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'text',
        sendedAt: 1612523408,
      },
      {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: 'Hello world',
        type: 'image',
        sendedAt: 1612099800,
      },
    ],
  }),

  mounted() {
    const self = this
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        self.coordinates = [position.coords.longitude, position.coords.latitude]
        // socket.emit('join', {
        //   coordinates: self.coordinates,
        // })

        // socket.once('message', (message) => {
        //   self.chat.push(message)
        // })

        // let watchID = navigator.geolocation.watchPosition(function (position) {
        //   socket.emit('move', {
        //     coordinates: [position.coords.longitude, position.coords.latitude],
        //   })
        // })
      })
    } else {
      /* la geolocalización NO está disponible */
    }
    socket.once('new-message', (message) => {
      this.messages.push(message)
    })
  },

  methods: {
    send() {
      const message = {
        username: 'username',
        profilePicture: 'https://picsum.photos/200',
        text: this.messageInput,
        coordinates: this.coordinates,
        sendedAt: Date.now(),
      }
      this.chat.push({ ...message, username: 'me' })
      this.messageInput = ''
      socket.emit('send', message)
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
</style>
