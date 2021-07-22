<template lang="pug">
v-card#chatPost.px-1.py-2.rounded-xl(
  v-if='content',
  color='primary',
  flat,
  width='100%'
)
  v-btn.pl-0.ml-2(
    rounded,
    dark,
    text,
    @click='$router.push({ path: `/${content.profile.username}` })'
  )
    v-avatar(color='primary', size='32')
      v-img(:src='content.profile.profile_picture')
    .text-capitalize.font-weight-bold.ml-1 {{ content.profile.username }}
  post.ma-1(:type='content.type', :content='content', grid)
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
