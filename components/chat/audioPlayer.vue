<template lang="pug">
#player
  audio(ref='audio', :src='src', preload='auto')
  div(v-if='!circular')
    v-layout.px-2
      v-btn(fab, dark, depressed, color='primary', small, @click='play')
        v-icon(small) {{ playing ? "fas fa-pause" : "fas fa-play" }}
      v-slider.ml-2.mt-1(
        v-if='audio',
        v-model='counter',
        step='0.1',
        min='0',
        :max='audio.duration',
        style='width: 200px'
      )
    v-layout.mb-2(v-if='duration != 0', justify-end, align-end)
      span.ml-2(v-if='!isNaN(counter)') {{ counter | getMinutes }}:{{ counter | getSeconds }} /
      span.ml-2(v-else) 00:00/
      span.mr-2 {{ Math.floor(duration) | getMinutes }}:{{ Math.floor(duration) | getSeconds }}
  .rounded-circle(v-else, @click='play', v-ripple)
    v-progress-circular(
      v-if='duration != 0',
      :value='(counter / duration) * 100',
      :size='230',
      :width='10',
      rotate='-90',
      color='white'
    )
</template>

<script>
export default {
  filters: {
    getMinutes(value) {
      return Math.floor(value / 60)
    },
    getSeconds(value) {
      if (value % 60 < 10) return '0' + (value % 60)
      return Math.floor(value % 60)
    },
  },
  props: {
    src: {
      type: String,
      default: '',
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    circular: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      audio: null,
      playing: false,
      counter: 0,
      duration: 0,
      interval: null,
    }
  },
  watch: {
    counter(value) {
      if (isFinite(value)) {
        this.audio.currentTime = value
      }
    },
  },
  mounted() {
    // this.audio = new Audio()
    this.audio = this.$refs.audio
    // this.audio.preload = "auto"
    // this.audio.src = this.src
    // this.audio.load()
    this.audio.addEventListener('durationchange', () => {
      if (isFinite(this.audio.duration)) {
        this.duration = this.audio.duration
      }
    })

    if (this.autoplay) {
      this.counter = 0
      this.play()
    }
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
        self.counter = 0
        this.interval = setInterval(function () {
          self.counter += 0.1
        }, 100)
      }
      this.playing = !this.playing
    },
  },
}
</script>
