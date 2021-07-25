<template lang="pug">
v-card(style='border-radius: 24px 24px 0 0', color="white", v-touch="{ down: () => closePlaceSelected() }",)
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
  .px-2(
    ref="postcontent",
    style='overflow-y: scroll; height: 100vh; padding-top: 120px'
  )
    .masonry(v-if='nearbyPosts.length !== 0')
      post.mb-2(
        v-for='(post, i) in nearbyPosts',
        :key='i',
        :type='post.type',
        :content='post',
        grid
      )
      .mb-15
    v-card.ma-2.rounded-xl(v-else, outlined)
      v-layout.pa-6.text-center(
        column,
        justify-center,
        align-center,
        color='white',
        style='height: 100%'
      )
        v-icon(color='primary', x-large) far fa-sad-cry
        .mt-4.black--text No hay posts en esta zona
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

  methods: {
    closePlaceSelected() {
      console.log('DOWN', this.$refs.postcontent.scrollTop)
      if (this.$refs.postcontent.scrollTop <= 50) {
        this.$emit('back')
      }
    },
  },
}
</script>
