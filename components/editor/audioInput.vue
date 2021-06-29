<template lang="pug">
#audioInput.d-flex(v-if='!notSupported', :class='{ "flex-row-reverse": left }')
  v-btn(
    :icon='!dark || recording',
    depressed,
    :fab='dark && !recording',
    :dark='dark && !recording',
    :color='dark && !recording ? "primary" : ""',
    @click='record'
  )
    v-icon(
      :class='{ "red--text": recording, "text--text": !dark }',
      :large='recording'
    ) {{ recording ? "fas fa-stop-circle" : "fas fa-microphone" }}
  v-chip.font-weight-bold.mx-1(v-if='recording', dark, color='red') {{ counter | getMinutes }}:{{ counter | getSeconds }}
</template>

<script>
import AudioRecorder from 'audio-recorder-polyfill'
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder'
AudioRecorder.encoder = mpegEncoder
AudioRecorder.prototype.mimeType = 'audio/mpeg'
window.MediaRecorder = AudioRecorder

export default {
  filters: {
    getMinutes(value) {
      return Math.floor(value / 60)
    },
    getSeconds(value) {
      if (value % 60 < 10) return '0' + (value % 60)
      return value % 60
    },
  },
  props: {
    left: Boolean,
    dark: Boolean,
  },
  data() {
    return {
      notSupported: false,
      recording: false,
      audioChunks: [],
      mediaRecorder: null,
      interval: null,
      counter: 0,
    }
  },
  methods: {
    mounted() {
      if (MediaRecorder.notSupported) {
        this.notSupported = true
      }
    },
    record() {
      if (this.recording) {
        this.recording = false
        clearInterval(this.interval)
        this.counter = 0
        this.mediaRecorder.stop()
        this.mediaRecorder.stream.getTracks().forEach((i) => i.stop())
      } else {
        this.recording = true
        const self = this
        this.interval = setInterval(function () {
          self.counter += 1
        }, 1000)

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream)
          this.mediaRecorder.start()

          this.mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(this.audioChunks, {
              type: this.mediaRecorder.mimeType,
            })

            this.$emit('update', audioBlob)
            // const audio = new Audio(audioUrl);
          })

          this.mediaRecorder.addEventListener('dataavailable', (event) => {
            this.audioChunks.push(event.data)
          })
        })
      }
    },
    // stopRecording() {

    // },
  },
}
</script>
