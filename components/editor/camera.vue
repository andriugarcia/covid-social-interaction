<template lang="pug">
v-card#camera(color='black')
  div
    vue-web-cam(
      ref='webcam',
      :device-id='deviceId',
      width='100%',
      height='100%',
      @started='onStarted',
      @stopped='onStopped',
      @error='onError',
      @cameras='onCameras',
      @camera-change='onCameraChange',
      style='position: absolute; top: 0; bottom: 0; right: 0; left: 0'
    )
    //- #camera(ref="camera", style="position: absolute; top: 0; bottom: 0; right: 0; left: 0;")
    v-layout.pt-4(
      align-center,
      style='position: absolute; top: 0; left: 0; right: 0'
    )
      v-btn.ml-4(icon, color='white', @click='$emit("back")')
        v-icon fas fa-times
    //- v-layout.pb-4(justify-center, align-center, style="position: absolute; bottom: 56px; left: 0; right: 0")
    //-   v-chip.mb-2(pill, dark) Mantener pulsado para grabar
    v-layout.pb-4.px-6(
      justify-space-around,
      align-center,
      style='position: absolute; bottom: 0; left: 0; right: 0'
    )
      div
        v-file-input(
          hide-input,
          dark,
          prepend-icon='far fa-images',
          @change='selectImage'
        )
      v-spacer
      v-btn.mr-2(
        fab,
        color='white',
        @click='onCapture',
        style='display: block'
      )
        v-avatar(color='white')
      v-btn(
        v-if='!recording',
        fab,
        small,
        depressed,
        color='black lighten-1',
        @click='onStart',
        style='display: block'
      )
        v-icon.red--text(small) fas fa-circle
      v-btn(
        v-else,
        fab,
        small,
        depressed,
        color='black lighten-1',
        @click='onStop',
        style='display: block'
      )
        v-icon.red--text(small) fas fa-stop
      v-spacer
      v-btn(icon, color='white')
        v-icon fas fa-exchange-alt
  v-card(
    color='black',
    v-if='img',
    style='position: absolute; top: 0; bottom: 0; right: 0; left: 0'
  )
    v-layout(align-center, style='height: 100%')
      v-img(:src='img')
      v-layout.pb-4.px-8(
        justify-space-between,
        align-center,
        style='position: absolute; bottom: 0; left: 0; right: 0'
      )
        v-btn(icon, color='white', @click='img = null')
          v-icon fas fa-times
        v-btn(icon, color='white', @click='acceptMedia')
          v-icon fas fa-check
  v-card(
    color='black',
    v-show='video',
    style='position: absolute; top: 0; bottom: 0; right: 0; left: 0'
  )
    v-layout(align-center, style='height: 100%')
      video(ref='video', controls)
      v-layout.pb-4.px-8(
        justify-space-between,
        align-center,
        style='position: absolute; bottom: 0; left: 0; right: 0'
      )
        v-btn(icon, color='white', @click='video = null')
          v-icon fas fa-times
        v-btn(icon, color='white', @click='acceptMedia')
          v-icon fas fa-check

//- option(v-for="device in devices", :key="device.deviceId", :value="device.deviceId") {{ device.label }}

//- button(type="button", @click="onCapture") Capture Photo
//- button(type="button", @click="onStop") Stop Camera
//- button(type="button", @click="onStart") Start Camera

//- img(:src="img")
</template>

<script>
import imageCompression from 'browser-image-compression'

export default {
  data() {
    return {
      img: null,
      video: null,
      camera: null,
      deviceId: null,
      devices: [],
      recording: false,
    }
  },
  computed: {
    device() {
      return this.devices.find((n) => n.deviceId === this.deviceId)
    },
  },
  watch: {
    camera(id) {
      this.deviceId = id
    },
    devices() {
      const [first, ...tail] = this.devices
      if (first) {
        this.camera = first.deviceId
        this.deviceId = first.deviceId
      }
    },
  },
  methods: {
    onCapture() {
      this.img = this.$refs.webcam.capture()
    },
    onStarted(stream) {
      console.log('On Started Event', stream)
    },
    onStopped(stream) {
      console.log('On Stopped Event', stream)
      // this.$refs.video.src = ''

      this.$refs.video.srcObject = stream
      this.$refs.video.onloadedmetadata = (e) => this.$refs.video.play()
      this.video = true
    },
    onStop() {
      this.$refs.webcam.stop()
      this.recording = false
    },
    onStart() {
      this.$refs.webcam.start()
      this.recording = true
    },
    onError(error) {
      console.log('On Error Event', error)
    },
    onCameras(cameras) {
      this.devices = cameras
      console.log('On Cameras Event', cameras)
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      console.log('On Camera Change Event', deviceId)
    },
    async acceptMedia() {
      const block = this.img.split(';')
      const contentType = block[0].split(':')[1]
      const realData = block[1].split(',')[1]

      const blob = this.b64toBlob(realData, contentType)
      console.log(blob)

      const fileCompressed = await this.compressFile(blob)
      console.log(fileCompressed)

      this.$emit('update', fileCompressed)
      this.$emit('back')
    },
    selectImage(file) {
      this.$emit('update', file)
      this.$emit('back')
    },
    async compressFile(imageFile) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }

      try {
        return await imageCompression(imageFile, options)
      } catch (error) {
        console.error(error)
      }
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512

      const byteCharacters = atob(b64Data)
      const byteArrays = []

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: contentType })
      return blob
    },
  },
}
</script>
