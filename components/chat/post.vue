<template lang="pug">
  #chatPost(v-if="content")
    v-btn.mb-4.pl-0.ml-2(rounded, text, @click="$router.push({ path: `/${content.author.username}` })")
      v-avatar(color="primary", size="32")
        v-img(:src="content.author.profilePicture")
      .font-weight-bold.ml-1 {{ content.author.username }}
    post(:type="content.type", :content="content", grid)
    .my-4
</template>

<script>
export default {
  async mounted() {
    const post = await this.getPost(this.src)
    this.content = post
  },
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  components: {
    post: () => import('../map/post.vue'),
  },
  data() {
    return {
      content: null,
    }
  },
  methods: {
    async getPost(src) {
      const data = await this.$store.dispatch('post/getPost', src)
      return data
    },
  },
}
</script>
