<template lang="pug">
v-card(style='border-radius: 24px 24px 0 0')
  v-toolbar(
    dark,
    flat,
    color='primary',
    extended,
    style='position: absolute; top: 0; left: 0; right: 0'
  )
    v-btn(icon, @click='$emit("back")')
      v-icon fas fa-times
    v-toolbar-title.font-weight-black En esta zona
    template(#extension)
      v-tabs(fixed-tabs)
        v-tab
          v-icon.mr-1(small) fas fa-map-pin
          div Posts
        v-tab
          v-icon.mr-1(small) fas fa-flag
          div Eventos
  .masonry.pa-2(style='overflow-y: scroll; height: calc(100vh - 32px)')
    post.mb-2(
      v-for='(post, i) in nearbyPosts',
      :key='i',
      :type='post.type',
      :content='post',
      grid
    )
</template>

<script>
import Post from '@/components/map/post'
export default {
  components: {
    Post,
  },
  props: {
    coordinates: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
    },
  },
  data() {
    return {
      nearbyPosts: [],
      nearbyEvents: [],
    }
  },
  async mounted() {
    const [nearbyPosts, nearbyEvents] = await Promise.all([
      this.$store.dispatch('post/getNearbyPosts', this.coordinates),
      this.$store.dispatch('event/getNearbyEvents', this.coordinates),
    ])

    this.nearbyPosts = nearbyPosts
    console.log(this.nearbyPosts)
    this.nearbyEvents = nearbyEvents
  },
}
</script>
