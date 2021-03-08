<template lang="pug">
  #audioMap.rounded-lg(style="background-color: white; height: 100%;")
    v-layout.pb-4.font-weight-light.audioExpanded(v-if="expanded", column, justify-center, align-center) 
      v-avatar(:size="200", color="primary")
        v-img(:src="content.author.profilePicture")
      audio-player.mt-6(:src="content.src", autoplay)
      //- span {{content.text}}
    v-layout.pb-4.audio(v-else, column, justify-center, align-center, :class="{'audioGrid': grid, 'audio': !grid}")
      v-avatar(color="primary", large, style="display: block")
        v-icon.white--text fas fa-play
      //- span.font-weight-light {{content.text | truncate}}
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
  margin: 24px;
  font-size: 1.2em;
}

.audio {
  font-size: 0.8em;
  display: block;
  width: 80px;
  min-height: 80px;
  height: auto;
  padding: 8px;
}

.audioExpanded {
  display: block;
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
