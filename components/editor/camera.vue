<template lang="pug">
  v-card#camera(color="black")
    div
      vue-web-cam(ref="webcam", :device-id="deviceId", width="100%", height="100%", @started="onStarted", @stopped="onStopped", @error="onError", @cameras="onCameras", @camera-change="onCameraChange", style="position: absolute; top: 0; bottom: 0; right: 0; left: 0;")
      v-layout.pt-4(align-center, style="position: absolute; top: 0; left: 0; right: 0")
        v-btn.ml-4(icon, color="white", @click="$emit('back')")
          v-icon fas fa-times
      v-layout.pb-4(justify-center, align-center, style="position: absolute; bottom: 56px; left: 0; right: 0")
        v-chip.mb-2(pill, dark) Mantener pulsado para grabar
      v-layout.pb-4(justify-space-around, align-center, style="position: absolute; bottom: 0; left: 0; right: 0")
        div
          v-file-input(hide-input, dark, prepend-icon="far fa-images", @change="selectImage")
        v-btn(fab, color="white", @click="onCapture", style="display: block;")
          v-avatar(color="white")
        v-btn(icon, color="white")
          v-icon fas fa-exchange-alt
    v-card(color="black", v-if="img", style="position: absolute; top: 0; bottom: 0; right: 0; left: 0;")
      v-layout(align-center, style="height: 100%")
        v-img(:src="img")
        v-layout.pb-4.px-8(justify-space-between, align-center, style="position: absolute; bottom: 0; left: 0; right: 0")
          v-btn(icon, color="white", @click="img = null")
            v-icon fas fa-times
          v-btn(icon, color="white", @click="acceptMedia")
            v-icon fas fa-check
    v-card(color="black", v-show="video", style="position: absolute; top: 0; bottom: 0; right: 0; left: 0;")
      v-layout(align-center, style="height: 100%")
        video(ref="video", controls)
        v-layout.pb-4.px-8(justify-space-between, align-center, style="position: absolute; bottom: 0; left: 0; right: 0")
          v-btn(icon, color="white", @click="video = null")
            v-icon fas fa-times
          v-btn(icon, color="white", @click="acceptMedia")
            v-icon fas fa-check

  //- option(v-for="device in devices", :key="device.deviceId", :value="device.deviceId") {{ device.label }}

  //- button(type="button", @click="onCapture") Capture Photo
  //- button(type="button", @click="onStop") Stop Camera
  //- button(type="button", @click="onStart") Start Camera

  //- img(:src="img")

</template>

<script>
export default {
  data() {
    return {
      img: null,
      video: null,
      camera: null,
      deviceId: null,
      devices: [],
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
      console.log('On Stopped Event', stream.getVideoTracks()[0])
      this.$refs.video.srcObject = stream
      this.$refs.video.play()
      this.video = true
    },
    onStop() {
      this.$refs.webcam.stop()
    },
    onStart() {
      this.$refs.webcam.start()
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
    acceptMedia() {
      this.$emit('update', this.img)
      this.$emit('back')
    },
    selectImage(file) {
      this.img = file
    },
  },
}
</script>
