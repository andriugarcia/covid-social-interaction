<template lang="pug">
  v-card.pa-2.pb-1.rounded-lg#chatPost(v-if="content", color="primary", flat)
    v-btn.mb-2.pl-0.ml-2(rounded, dark, text, @click="$router.push({ path: `/${content.profile.username}` })")
      v-avatar(color="primary", size="32")
        v-img(:src="content.profile.profile_picture")
      .text-capitalize.font-weight-bold.ml-1 {{ content.profile.username }}
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
