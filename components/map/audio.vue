<template lang="pug">
#audioMap.rounded-lg(style='background-color: white; height: 100%')
  v-sheet(v-if='expanded', color='primary', dark, style='height: 100%')
    v-layout.font-weight-light.audioExpanded(
      justify-center,
      align-center,
      style='padding-bottom: 160px'
    )
      div(style='position: relative; height: 230px; width: 230px')
        v-layout(
          justify-center,
          align-center,
          style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%'
        )
          v-avatar.mt-12(:size='200', color='primary')
            v-img(:src='content.profile_picture')
        audio-player.mt-6(
          :src='content.src',
          autoplay,
          circular,
          style='z-index: 10'
        )
      //- span {{content.text}}
  div(v-else)
    .d-flex.align-stretch
      v-sheet.rounded-lg(color='primary', dark)
        v-layout(align-center, style='height: 100%')
          v-icon.pa-2(small) fas fa-microphone
      p.pb-4.mb-0.ml-2.font-weight-light(
        v-if='content.text.length != 0',
        :class='{ audioGrid: grid, audio: !grid }',
        v-html='content.text'
      )
      p.pb-4.mb-0.ml-2.font-weight-light(
        v-else,
        :class='{ audioGrid: grid, audio: !grid }'
      ) {{ "Audio" }}
</template>

<script>
export default {
  filters: {
    truncate(value) {
      const limit = 64
      if (value.length > limit) return value.substr(0, limit) + '...'
      return value
    },
  },
  components: {
    audioPlayer: () => import('../chat/audioPlayer'),
  },
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
    expanded: Boolean,
    grid: Boolean,
  },
}
</script>

<style scoped>
.audioGrid {
  display: block;
  width: 1000px;
  height: auto;
  font-size: 0.8em;
}

.audio {
  font-size: 0.8em;
  display: block;
  width: 80px;
  height: auto;
  padding: 8px;
}

.audioExpanded {
  /* display: block; */
  width: 100%;
  height: 100%;

  /* max-height: 100vh;
  min-height: 60vh; */

  /* max-width: 400px;
  min-width: 480px; */
  padding: 32px;
  padding-top: 82px;
  font-size: 1.2em;
}
</style>
