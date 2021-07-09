<template lang="pug">
  v-layout#videoMap(column, justify-center, style="height: 100%")
    video.rounded-lg(:class="{'videoGrid': grid, 'videoPost': !expanded && !grid, 'videoPostExpanded': expanded, 'mt-8': content.text.length != 0 && expanded}", autoplay, playsinline, :muted="muted", loop, :src="content.src")
</template>

<script>
export default {
  props: {
    expanded: Boolean,
    content: {
      type: Object,
      default: () => ({}),
    },
    muted: Boolean,
    grid: Boolean,
  },
}
</script>

<style scoped>
.videoGrid {
  display: block;
  width: 100%;
  height: auto;
}

.videoPost {
  display: block;
  max-width: 100px;
  max-height: 100px;
  width: auto;
  height: auto;
}

.videoPostExpanded {
  display: block;
  max-width: 100vw;
  max-height: 100vh;
  width: auto;
  height: auto;
}
</style>
