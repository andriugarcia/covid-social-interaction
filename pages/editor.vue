<template lang="pug">
#editor(style='position: relative; height: 100%')
  v-toolbar(color='primary', dark)
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    v-toolbar-title Nuevo Post
    v-spacer
    //- v-btn.text-capitalize(rounded, depressed, small, dark, color="text", @click="permanentOpened = true") 
      span Hacer permanente
      v-icon.ml-2(small) far fa-snowflake
  v-layout.px-4
    v-avatar.mr-2.mt-6(size='48', style='border: 3px solid #f0134d')
      v-img(:src='user.profile_picture')
    div(style='width: 100%')
      texteditor.mt-6.pb-2(
        v-model='post.text',
        style='max-height: 30vh; overflow-y: auto',
        placeholder='¿Qué quieres contar a tu alrededor?'
      )
      v-divider(color='grey')
      v-layout(justify-space-between, align-center)
        span.red--text(v-if='removeHTML(post.text).length > limit') Límite excedido
        v-spacer
        span.pt-2(
          :class='{ "red--text": removeHTML(post.text).length > limit }'
        ) {{ removeHTML(post.text).length }} / {{ limit }}
    //- v-textarea(placeholder="Escribe tu post", :counter="limit", v-model="post.text", auto-grow, persistent-hint, :hint="post.text.length > 80 ? 'Solo se verá en el mapa los primeros 80 carácteres' : ''", rows="1")

  v-card.pa-2.rounded-xl.mt-2(v-if='post.type == "audio"', outlined)
    v-progress-circular(v-if='uploading', indeterminate, color='primary')
    audio-player(v-else, :src='post.src')
  v-card.pa-1.rounded-xl(
    v-if='post.type == "image" || post.type == "video"',
    flat,
    color='primary',
    style='position: relative'
  )
    .rounded-xl(style='overflow: hidden')
      v-img.rounded-xl(
        v-if='post.type == "image"',
        :src='post.src',
        max-width='500',
        max-height='300',
        :class='{ blured: uploading }'
      )
      video.rounded-xl(
        v-else-if='post.type == "video"',
        :src='post.src',
        preload='metadata',
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
    v-btn(
      v-if='!uploading',
      fab,
      depressed,
      small,
      dark,
      @click='removeImage',
      style='position: absolute; top: 8px; right: 8px'
    )
      v-icon fas fa-times
  div(style='position: absolute; bottom: 0; left: 0; right: 0')
    v-btn.ml-3.mb-2.rounded-lg(
      v-if='currentEvent',
      :outlined='!eventSelected',
      depressed,
      :color='eventSelected ? "primary" : "grey lighten-3"',
      @click='eventSelected = !eventSelected',
      style='display: block'
    )
      span.mr-2(style='font-size: 1.7em') {{ currentEvent.event.emoji }}
      span.text-capitalize.letter-spacing-none(
        :class='{ "black--text": !eventSelected, "white--text": eventSelected }'
      ) {{ currentEvent.event.title }}
    v-btn.px-2.ml-3.rounded-lg(
      outlined,
      color='grey lighten-3',
      @click='locationSelectorOpened = true'
    )
      v-icon.text--text fas fa-globe-europe
      .ml-2.text--text.font-weight-bold.text-capitalize.letter-spacing-none {{ locationMessage }}
    v-divider.my-2
    v-layout.pa-4(justify-space-between, align-center)
      //- audio-input(@update='audioUpdated')
      v-btn.mr-2(
        v-if='!$vuetify.breakpoint.mdAndUp',
        fab,
        small,
        depressed,
        dark,
        color='text'
      )
        v-icon(small) fas fa-camera
        input(
          type='file',
          @change='imageUpdated',
          accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm',
          capture='camera',
          style='opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0'
        )
      v-btn(icon)
        v-icon.text--text fas fa-image
        input(
          type='file',
          @change='imageUpdated',
          accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm',
          style='opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0'
        )
      //- v-btn.mx-1(icon)
      //-   v-icon.text--text fas fa-image
      v-spacer
      v-btn(
        rounded,
        depressed,
        color='primary',
        :disabled='disabled',
        dark,
        @click='publish'
      )
        v-icon(small) fas fa-plus
        .ml-2.text-capitalize Publicar
  v-dialog(
    v-model='locationSelectorOpened',
    fullscreen,
    hide-overlay,
    transition='dialog-bottom-transition'
  )
    v-card
      location-select(
        v-if='locationSelectorOpened',
        :initialPosition='initialPositionWithDefault',
        :zoom='initialPosition ? 15 : 5',
        @updated='updateLocation',
        @back='locationSelectorOpened = false'
      )
  v-bottom-sheet(v-model='permanentOpened')
    v-card.pa-4.rounded-lg
      v-subheader POST PERMANENTE
      p.mt-2 El post no desaparecerá del mapa siendo visible mientras permanezca activo
      v-text-field(
        type='number',
        suffix='€/mes',
        autofocus,
        v-model='bidValue'
      )
      span Audiencia mensual estimada: <b>1000 visualizaciones</b>
      v-btn.mt-4(block, color='primary', rounded) ACTIVAR
</template>

<script>
import audioInput from '@/components/editor/audioInput'
import texteditor from '@/components/editor/textarea'

// import imageCompression from 'browser-image-compression';

export default {
  components: {
    locationSelect: () => import('../components/map/locationSelect'),
    groupSelect: () => import('../components/editor/groupSelect'),
    audioPlayer: () => import('../components/chat/audioPlayer'),
    audioInput,
    texteditor,
  },

  data() {
    return {
      currentPosition: true,
      uploading: false,
      limit: 250,
      currentEvent: null,
      eventSelected: true,
      post: {
        type: 'short',
        coordinates: this.$store.state.map.userPosition,
        createdAt: Date.now().toString(),
        text: '',
        src: '',
        event: null,
      },
      locationSelectorOpened: false,
      permanentOpened: false,
      bidValue: 1,
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    initialPosition() {
      return this.$store.state.map.userPosition
    },
    initialPositionWithDefault() {
      if (this.$store.state.map.userPosition)
        return this.$store.state.map.userPosition
      return { lat: 41, lng: -3.7 }
    },
    disabled() {
      return (
        (this.currentPosition && !this.initialPosition) ||
        this.post.text.length >= this.limit ||
        this.uploading
      )
    },
    locationMessage() {
      if (this.currentPosition && !this.initialPosition) {
        return 'Seleccionar Ubicación'
      } else if (this.currentPosition) {
        return 'Tu ubicación actual'
      } else {
        return `${this.post.coordinates.lng.toFixed(
          6
        )}, ${this.post.coordinates.lat.toFixed(6)}`
      }
    },
  },

  mounted() {
    const event = this.$store.getters['event/currentEvent']

    if (typeof event === 'undefined') {
      this.currentEvent = null
    } else {
      this.currentEvent = event
    }
  },

  methods: {
    updateLocation(coordinates) {
      this.currentPosition = false
      this.post.coordinates = coordinates
    },
    removeHTML(str) {
      const div = document.createElement('div')
      div.innerHTML = str
      const text = div.textContent || div.textContent || ''
      return text
    },
    // async compressFile(imageFile) {
    //   const options = {
    //     maxSizeMB: 10,
    //     maxWidthOrHeight: 1920,
    //     useWebWorker: true
    //   }

    //   try {
    //     return await imageCompression(imageFile, options);
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },
    async imageUpdated(ev) {
      const file = ev.target.files[0]
      this.uploading = true

      let data
      this.previewImage(file)
      if (file.type.startsWith('image')) {
        this.post.type = 'image'

        data = await this.$store.dispatch('storage/uploadFile', file)
      } else if (file.type.startsWith('video')) {
        this.post.type = 'video'

        data = await this.$store.dispatch('storage/uploadVideo', file)
      }

      this.post.src = data.location
      this.uploading = false
    },
    async audioUpdated(audioBlob) {
      this.uploading = true
      this.post.type = 'audio'

      const { location } = await this.$store.dispatch(
        'storage/uploadAudio',
        audioBlob
      )
      this.post.src = location

      this.uploading = false
    },
    removeImage() {
      this.post.type = 'text'
      this.post.src = null
    },
    async publish() {
      if (this.currentEvent && this.eventSelected) {
        this.post.event = this.currentEvent.event.event_id
      }
      if (await this.$store.dispatch('post/createPost', this.post)) {
        this.$router.replace({ path: '/' })
      }
    },
    previewImage(image) {
      const reader = new FileReader()

      const self = this
      reader.onload = function (e) {
        self.post.src = e.target.result
      }
      reader.readAsDataURL(image)
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
