<template lang="pug">
  #shortMap.rounded-lg(v-if="group", style="background-color: white; height: 100%;")
    //- p.pb-4.font-weight-light.shortExpanded(v-if="expanded") {{content.text}}
    v-layout.pb-4.short(:class="{'shortGrid': grid, 'short': !grid}")
      v-avatar(size="32")
        v-img(:src="group.cover")
      span.mx-2 {{ group.title }}
      v-chip.px-2(small, color="primary")
        span {{ Object.keys(group.members).length }}
        v-icon.ml-1(small) fas fa-users
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
  data() {
    return {
      group: null,
    }
  },
  async mounted() {
    this.group = await this.$store.dispatch(
      'chat/getGroupForMap',
      this.content.src
    )
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
  font-size: 1em;
  display: block;
  min-width: 120px;
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
