<template lang="pug">
  #shortMap.rounded-lg(style="background-color: white; height: 100%;")
    p.pb-4.font-weight-light.shortExpanded(v-if="expanded") {{content.text}}
    p.pb-4.font-weight-light.short(v-else, :class="{'shortGrid': grid, 'short': !grid}") {{content.text | truncate}}
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
  font-size: 0.8em;
  display: block;
  width: 120px;
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
  padding-top: 100px;
  font-size: 1.2em;
}
</style>
