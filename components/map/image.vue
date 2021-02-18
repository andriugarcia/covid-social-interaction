<template lang="pug">
  #imageMap
    img.rounded-lg(:class="{'imageGrid': grid, 'imagePost': !expanded && !grid, 'imagePostExpanded': expanded}", :src="content.src")
</template>

<script>
export default {
  props: {
    expanded: Boolean,
    content: {
      type: Object,
      default: () => ({}),
    },
    grid: Boolean,
  },
}
</script>

<style scoped>
.imageGrid {
  display: block;
  width: 100%;
  height: auto;
}

.imagePost {
  display: block;
  max-width: 100px;
  max-height: 100px;
  width: auto;
  height: auto;
}

.imagePostExpanded {
  display: block;
  max-width: 100vw;
  max-height: 80vh;
  width: auto;
  height: auto;
}
</style>
