<template lang="pug">
v-card#saved
  v-toolbar(
    color='primary',
    flat,
    dark,
    style='position: absolute; top: 0; left: 0; right: 0; z-index: 10'
  )
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    v-toolbar-title Guardados
  div(ref='scrollarea', style='height: 100vh; overflow-y: scroll')
    v-sheet.px-2.pt-15.pb-4(color='white', style='height: 100%')
      masonry.pt-2(v-if='posts.length != 0', :cols='2', :gutter='10')
        post.mb-2(
          v-for='(publication, i) in posts',
          :key='i',
          :type='publication.post.type',
          :content='publication.post',
          grid
        )
  .text-center.py-4(v-if='loading')
    v-progress-circular(indeterminate, color='primary')
</template>

<script>
import Post from '../components/map/post'
export default {
  head: {
    title: 'Posts Guardados | Olimaps',
  },
  components: {
    Post,
  },
  data() {
    return {
      posts: [],
      finished: false,
      loading: false,
      page: 1,
    }
  },
  async mounted() {
    this.posts = await this.$store.dispatch('post/getSavedPosts')
    this.$refs.scrollarea.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    this.$refs.scrollarea.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async handleScroll() {
      if (
        !this.finished &&
        this.$refs.scrollarea.scrollTop + 1000 >=
          this.$refs.scrollarea.scrollHeight &&
        !this.loading
      ) {
        this.loading = true
        const newPosts = await this.$store.dispatch(
          'post/getSavedPosts',
          this.page
        )
        this.posts.push(...newPosts)
        this.page++
        if (newPosts.length <= 0) {
          this.finished = true
        }
        this.loading = false
      }
    },
  },
}
</script>
