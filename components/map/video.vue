<template lang="pug">
  v-layout#videoMap(align-center, style="height: 100%")
    video.rounded-lg(:class="{'videoGrid': grid, 'videoPost': !expanded && !grid, 'videoPostExpanded': expanded}", autoplay, :muted="muted", loop)
      source(src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm", type="video/webm")
      source(src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4", type="video/mp4")
</template>

<script>
export default {
  props: {
    expanded: Boolean,
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
