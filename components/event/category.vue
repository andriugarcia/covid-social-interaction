<template lang="pug">
  v-chip.ml-4.mt-n6(:color="categories[cat].color", dark)
    v-icon.mr-1(x-small) {{ categories[cat].icon }}
    span.font-weight-bold {{ categories[cat].name }}
</template>

<script>
export default {
  props: {
    cat: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      categories: this.$store.state.event.categories,
    }
  },
}
</script>
