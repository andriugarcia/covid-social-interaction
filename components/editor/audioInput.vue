<template lang="pug">
#audioInput.d-flex(v-if='!notSupported', :class='{ "flex-row-reverse": left }')
  v-card.rounded-pill(outlined, style='width: 100%')
    v-layout(justify-space-between, align-center)
      v-chip.font-weight-bold.ml-3(v-if='recording', dark, color='red') {{ counter | getMinutes }}:{{ counter | getSeconds }}
      v-spacer
      span.mr-2.red--text(v-if='recording') {{touching ? '<< Desliza para cancelar' : 'Pulsa para enviar >>'}}
      v-btn(
        depressed,
        fab,
        dark,
        color='primary',
        @touchstart.prevent='handleTouch',
        @touchend='handleEnd',
        @click='record'
        v-touch='{left: () => cancelAudio()}'
      )
        v-icon {{ recording ? 'fas fa-stop-circle' : 'fas fa-microphone'}}
      //- v-btn(
        :icon='!dark || recording',
        depressed,
        :fab='dark && !recording',
        :dark='dark && !recording',
        :color='dark && !recording ? "primary" : ""',
        @touchstart.prevent='handleTouch',
        @touchend='handleEnd'
      //- )
        //- @click='record'
        v-icon(
          :class='{ "red--text": recording, "text--text": !dark }',
          :large='recording'
        ) {{ recording ? "fas fa-stop-circle" : "fas fa-microphone" }}
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
      cancelled: false,
      touching: false,
    }
  },
  methods: {
    startRecording() {
      if (typeof window.navigator !== 'undefined') window.navigator.vibrate(50)
      console.log('Starting recording')
      this.recording = true
      this.$emit('recordstart')
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.interval = setInterval(() => {
          this.counter += 1
        }, 1000)
        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.start()

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          this.audioChunks.push(event.data)
        })
      })
    },
    stopRecording() {
      console.log('Stop recording')
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.mediaRecorder.mimeType,
        })

        setTimeout(() => {
          if (this.cancelled || this.counter < 1) this.cancelled = false
          else this.$emit('update', audioBlob)

          this.counter = 0

          this.mediaRecorder = null
          this.touching = false
        }, 200)
        // const audio = new Audio(audioUrl);
      })

      this.$emit('recordstop')
      this.recording = false

      clearInterval(this.interval)
      if (this.mediaRecorder) {
        if (typeof window.navigator !== 'undefined')
          window.navigator.vibrate(50)
        this.mediaRecorder.stop()
        this.mediaRecorder.stream.getTracks().forEach((i) => i.stop())
      }
    },
    handleTouch() {
      console.log('touch start')
      this.touching = true
      this.startRecording()
    },
    handleEnd() {
      this.touching = false
      this.stopRecording()
    },
    cancelAudio() {
      console.log('canceled')
      this.cancelled = true
    },
    mounted() {
      if (MediaRecorder.notSupported) {
        this.notSupported = true
      }
    },
    record() {
      if (this.recording) {
        this.stopRecording()
      } else {
        this.startRecording()
      }
    },
    // stopRecording() {

    // },
  },
}
</script>
