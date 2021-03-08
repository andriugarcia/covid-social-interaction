<template lang="pug">
  #editor.pa-4
    v-layout(justify-space-between, align-center)
      v-btn(icon, @click="$router.go(-1)")
        v-icon.text--text fas fa-arrow-left
      v-btn.text-capitalize(outlined, rounded, small, color="text", @click="permanentOpened = true") 
        span.text--text Hacer permanente
        v-icon.text--text.ml-2(small) far fa-snowflake
    v-layout.pt-4
      v-avatar.mr-2.mt-2.elevation-5(size="40")
        v-img(:src="user.profilePicture")
      v-textarea(placeholder="Escribe tu post", counter="120", v-model="post.text", auto-grow, rows="1")
    v-card.pa-2.rounded-xl.mt-2(v-if="post.type == 'group'", outlined)
      v-layout(align-center)
        v-avatar
          v-img(:src="group.cover")
        span.ml-2 {{ group.title }}
        v-spacer
        v-btn(icon, @click="removeGroup")
          v-icon fas fa-times-circle
    v-card.pa-2.rounded-xl.mt-2(v-if="post.type == 'audio'", outlined)
      v-progress-circular(v-if="uploading", indeterminate, color="primary")
      audio-player(v-else, :src="post.src")
    v-card.pa-1.rounded-xl(v-if="post.type == 'image'", flat, color="primary", style="position: relative;")
      .rounded-xl(style="overflow: hidden")
        v-img.rounded-xl(:src="post.src", max-width="500", max-height="300", :class="{'blured': uploading}")
      v-row.fill-height.ma-0(v-if="uploading" ,align="center", justify="center", style="position: absolute; top: 0px; right: 0px; left: 0; bottom: 0;")
        v-progress-circular(indeterminate, color="grey lighten-5")
      v-btn(v-if="!uploading", fab, depressed, small, dark, @click="removeImage", style="position: absolute; top: 8px; right: 8px;")
        v-icon fas fa-times
    div(style="position: absolute; bottom: 0; left: 0; right: 0;")
      v-dialog(v-model="locationSelectorOpened", fullscreen, hide-overlay, transition="dialog-bottom-transition")
        template(v-slot:activator="{on, attrs}")
          v-btn(v-on="on", text)
            v-icon.text--text fas fa-globe-europe
            .ml-2.text--text.font-weight-bold.text-capitalize(style="letter-spacing: 0;") {{ currentPosition ? 'Tu ubicación actual' : `${initialPosition.lng.toFixed(6)}, ${initialPosition.lat.toFixed(6)}`}}
        v-card
          location-select(:initialPosition="initialPosition", @updated="updateLocation", @back="locationSelectorOpened = false")
      v-divider.my-2
      v-layout.pa-4(justify-space-between)
        v-layout
          audio-input(@update="audioUpdated")
          v-divider.mx-2(vertical)
          v-btn.mx-1(icon, @click="cameraToggle = true")
            v-icon.text--text fas fa-camera
          //- v-btn.mx-1(icon)
          //-   v-icon.text--text fas fa-image
          v-btn.mx-1(icon)
            v-icon.text--text fas fa-flag
          v-btn.mx-1(icon, @click="groupToggle = true")
            v-icon.text--text fas fa-user-friends
        v-spacer
        v-btn(rounded, flat, color="primary", dark, @click="publish")
          .mr-2.text-capitalize Publicar
          v-icon(small) far fa-edit
    v-bottom-sheet(v-model="permanentOpened")
      v-card.pa-4.rounded-lg
        v-subheader POST PERMANENTE
        p.mt-2 El post no desaparecerá del mapa siendo visible mientras permanezca activo
        v-text-field(type="number", suffix="€/mes", autofocus, v-model="bidValue")
        span Audiencia mensual estimada: <b>1000 visualizaciones</b>
        v-btn.mt-4(block, color="primary", rounded) ACTIVAR
    v-dialog(v-model="cameraToggle", fullscreen)
      camera(v-if="cameraToggle", @back="cameraToggle = false", @update="imageUpdated")
    v-dialog(v-model="groupToggle", fullscreen)
      group-select(@back="groupToggle = false", @selected="selectGroup")
</template>

<script>
import audioInput from '@/components/editor/audioInput'
export default {
  components: {
    locationSelect: () => import('../components/map/locationSelect'),
    groupSelect: () => import('../components/editor/groupSelect'),
    camera: () => import('../components/editor/camera'),
    audioPlayer: () => import('../components/chat/audioPlayer'),
    audioInput,
  },

  data() {
    return {
      currentPosition: true,
      uploading: false,
      post: {
        type: 'short',
        coordinates: { lat: 40.40860001, lon: -3.689840001 },
        createdAt: Date.now().toString(),
        text: '',
        src: '',
      },
      locationSelectorOpened: false,
      permanentOpened: false,
      bidValue: 1,
      cameraToggle: false,
      groupToggle: false,
      group: {},
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    initialPosition() {
      return this.$store.state.map.userPosition
    },
  },

  methods: {
    updateLocation({ lat, lng }) {
      this.currentPosition = false
      this.post.coordinates = {
        lat,
        lon: lng,
      }
    },
    async imageUpdated(image) {
      this.uploading = true
      this.post.type = 'image'

      this.previewImage(image)

      const data = await this.$store.dispatch('storage/uploadFile', image)
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
    selectGroup(group) {
      this.post.type = 'group'
      this.post.src = group.chatid
      this.group = group
    },
    removeGroup() {
      this.post.type = 'short'
      this.post.src = ''
      this.group = {}
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
