<template lang="pug">
v-layout#imageMap(column, justify-center, style='height: 100%')
  img(
    :class='{ imageGrid: grid, imagePost: !expanded && !grid, imagePostExpanded: expanded }',
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

.black-bottom-gradient {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
}
</style>
