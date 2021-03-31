<template lang="pug">
  #chatPost(v-if="content")
    v-btn.mb-4.pl-0.ml-2(rounded, text, @click="$router.push({ path: `/${content.profile.username}` })")
      v-avatar(color="primary", size="32")
        v-img(:src="content.profile.profile_picture")
      .font-weight-bold.ml-1 {{ content.profile.username }}
    post(:type="content.type", :content="content", grid)
    .my-4
</template>

<script>
export default {
  components: {
    post: () => import('../map/post.vue'),
  },
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
