<template lang="pug">
  #shortMap.rounded-lg(style="background-color: white; height: 100%;")
    v-layout.pb-4.font-weight-light.shortExpanded(v-if="expanded", column, justify-center, align-center) 
      v-avatar(:size="200", color="primary")
        v-img(:src="content.author.profilePicture")
      audio-player.mt-6(:src="content.src", autoplay)
      //- span {{content.text}}
    v-layout.pb-4.short(v-else, column, align-center, :class="{'shortGrid': grid, 'short': !grid}")
      v-avatar(color="primary", large)
        v-icon fas fa-play
      span 00:15
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
.shortGrid {
  display: block;
  width: 1000px;
  height: auto;
  margin: 24px;
  font-size: 1.2em;
}

.short {
  font-size: 1.2em;
  display: block;
  width: 80px;
  min-height: 20px;
  height: auto;
  padding: 8px;
}

.shortExpanded {
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
