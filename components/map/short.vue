<template lang="pug">
#shortMap.rounded-lg(style='background-color: white; height: 100%')
  p.pb-4.font-weight-light.shortExpanded(
    v-if='expanded',
    v-html='content.text'
  )
  p.font-weight-light(
    v-else,
    :class='{ shortGrid: grid, short: !grid }',
    :inner-html.prop='content.text | truncate'
  )
</template>

<script>
export default {
  filters: {
    truncate(value) {
      const limit = 56
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
  /* width: 100vw; */
  width: 100%;
  font-size: 0.8em;
  display: block;
  height: auto;
  padding: 8px;
}

.short {
  font-size: 0.8em;
  display: block;
  min-width: 64px;
  max-width: 120px;
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
  padding: 56px 32px;
  font-size: 1.2em;
}
</style>
