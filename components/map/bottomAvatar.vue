<template lang="pug">
  v-layout(column, align-center)
    v-avatar(size="24", color="white")
      v-img(:src="src")
    .triangle.mt-n1
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
.triangle {
  width: 0;
  height: 0;
  border-bottom: 0 solid black;
  border-top: 9px solid black;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
}
</style>
