<template lang="pug">
  v-avatar.mr-2(color="grey lighten-2", size="92")
    v-progress-circular(v-if="loading", indeterminate, color="grey")
    v-icon(v-else-if="src.length == 0", large) far fa-image
    v-img(v-else, :src="src")
    input(@change="selectImage", type="file", style="opacity: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0;")
</template>

<script>
export default {
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
