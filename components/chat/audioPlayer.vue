<template lang="pug">
  #player
    v-layout.px-2
      v-btn(fab, dark, color="primary", small, @click="play")
        v-icon(small) {{ playing ? 'fas fa-pause' : 'fas fa-play'}}
      v-slider.ml-2.mt-1(v-if="audio", step="1", min="0", :max="audio.duration", style="width: 200px;")
    v-layout.mb-2(v-if="audio", justify-end, align-end)
      span.ml-2 {{counter | getMinutes}}:{{counter | getSeconds}}
      span.mr-2 / {{Math.floor(audio.duration) | getMinutes}}:{{Math.floor(audio.duration) | getSeconds}}
</template>

<script>
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
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      audio: null,
      playing: false,
      counter: 0,
      interval: null,
    }
  },
  computed: {
    // timeTrack: {
    //   get() {
    //     return this.counter
    //   },
    //   set(value) {
    //     this.counter = value
    //     // this.audio.currentTime = value
    //   },
    // }
  },
  mounted() {
    this.audio = new Audio(this.src)
    this.audio.load()
  },
  methods: {
    play() {
      if (this.playing) {
        this.audio.pause()
        clearInterval(this.interval)
        this.counter = 0
      } else {
        this.audio.play()
        const self = this
        this.interval = setInterval(function () {
          self.counter += 1
        }, 1000)
      }
      this.playing = !this.playing
    },
  },
}
</script>
