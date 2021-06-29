<template lang="pug">
v-card#saved
  v-toolbar(color='primary', dark)
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    span.font-weight-black Guardados
  masonry.pa-2(v-if='posts.length != 0', :cols='2', :gutter='10')
    post.mb-2(
      v-for='(publication, i) in posts',
      :key='i',
      :type='publication.post.type',
      :content='publication.post',
      grid
    )
</template>

<script>
import Post from '../components/map/post'
export default {
  components: {
    Post,
  },
  data() {
    return {
      posts: [],
    }
  },
  async mounted() {
    this.posts = await this.$store.dispatch('post/getSavedPosts')
  },
}
</script>
