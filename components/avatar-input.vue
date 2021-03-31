<template lang="pug">
  v-avatar.mr-2(v-if="!large", color="grey lighten-2", size="92")
    v-progress-circular(v-if="loading", indeterminate, color="grey")
    v-icon(v-else-if="src.length == 0", large) far fa-image
    v-img(v-else, :src="src")
    input(@change="selectImage", type="file", style="opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0;")
  v-card.mr-2(v-else, color="grey lighten-2", flat, style="height: 140px; width: 100%")
    v-layout(align-center, justify-center, style="height: 100%")
      v-progress-circular(v-if="loading", indeterminate, color="grey")
      v-icon(v-else-if="src.length == 0", large) far fa-image
      v-img(v-else, :src="src", height="140px")
    input(@change="selectImage", type="file", style="opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0;")
</template>

<script>
export default {
  props: {
    large: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      src: '',
      loading: false,
    }
  },
  methods: {
    async selectImage({ target }) {
      this.loading = true
      const data = await this.$store.dispatch(
        'storage/uploadFile',
        target.files[0]
      )
      this.src = data.location
      this.$emit('update', data.location)
      this.loading = false
    },
  },
}
</script>
