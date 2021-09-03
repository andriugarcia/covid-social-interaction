<template lang="pug">
v-layout#imageMap.black-bottom-gradient(
  column,
  justify-center,
  style='height: 100%'
)
  v-img(
    v-if='expanded',
    contain,
    gradient='to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 15%, rgba(255,255,255,0) 50%',
    :class='{ imageGrid: grid, "rounded-lg": !expanded, imagePost: !expanded && !grid, imagePostExpanded: expanded }',
    :src='content.src'
  )
  img(
    v-else,
    :class='{ imageGrid: grid, "rounded-lg": !expanded, imagePost: !expanded && !grid, imagePostExpanded: expanded }',
    :src='content.src'
  )
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

  /* max-width: 100vw; */
  max-height: 100%;
  width: 100%;
  height: auto;
}
</style>
