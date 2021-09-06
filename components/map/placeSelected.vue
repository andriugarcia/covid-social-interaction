<template lang="pug">
v-card(:style='!$vuetify.breakpoint.mdAndUp ? "border-radius: 24px 24px 0 0" : ""', color="white", v-touch="{ down: () => closePlaceSelected() }",)
  v-toolbar(
    dark,
    flat,
    color='primary',
    extended,
    style='position: absolute; top: 0; left: 0; right: 0; z-index: 20; overflow-y: none'
  )
    v-btn(icon, @click='$emit("back")')
      v-icon fas fa-chevron-down
    v-toolbar-title.font-weight-black En esta zona
    template(#extension)
      v-tabs(v-model='tab', fixed-tabs)
        v-tab(key='posts')
          v-icon.mr-1(small) fas fa-map-pin
          div Posts
        v-tab(key='events')
          v-icon.mr-1(small) fas fa-flag
          div Eventos
  .px-2(ref="scrollarea",
      style='padding-top: 116px; overflow-y: scroll;',
      :style='$vuetify.breakpoint.mdAndUp ? "height: 90vh" : "height: 100vh"')
    v-tabs-items.px-2(
      v-model='tab', style='background-color: transparent;'
    )
      v-tab-item(key='posts')
        v-btn(rounded, color='primary', block, depressed, @click='openEditor')
          v-icon.mr-2(small) fas fa-plus
          span.text-capitalize Publicar Aquí
        .text-center.pt-2(v-if='loading')
          v-progress-circular(indeterminate, color='primary')
        .masonry.mt-4(v-else-if='nearbyPosts.length !== 0')
          post.mb-2(
            v-for='(post, i) in nearbyPosts',
            :key='i',
            :type='post.type',
            :content='post',
            grid
          )
        v-card.my-2.rounded-xl(v-else, outlined)
          v-layout.pa-6.text-center(
            column,
            justify-center,
            align-center,
            color='white',
            style='height: 100%'
          )
            v-icon(color='primary', x-large) far fa-sad-cry
            .mt-4.black--text No hay posts en esta zona
      v-tab-item(key='events')
        .text-center.pt-2(v-if='loading')
          v-progress-circular(indeterminate, color='primary')
        v-alert(
          v-else-if='nearbyEvents.length === 0',
          type='error',
          text,
          icon='far fa-sad-tear',
          prominent
        ) No hay eventos cerca
        event.mb-2(v-for='(event, i) in nearbyEvents', :key='i', :event='event')
</template>

<script>
import Post from '@/components/map/post'
import Event from '@/components/event/item'
export default {
  components: {
    Post,
    Event,
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
      loading: false,
      finished: false,
      postsPage: 1,
      eventsPage: 1,
      tab: 'posts',
    }
  },
  async mounted() {
    this.loading = true
    const [nearbyPosts, nearbyEvents] = await Promise.all([
      this.$store.dispatch('post/getNearbyPosts', {
        coordinates: this.coordinates,
        page: 0,
      }),
      this.$store.dispatch('event/getNearbyEvents', {
        coordinates: this.coordinates,
        page: 0,
      }),
    ])

    this.nearbyPosts = nearbyPosts
    this.nearbyEvents = nearbyEvents

    this.loading = false
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
        if (this.tabs == 'posts') {
          const newNearbyPosts = await this.$store.dispatch(
            'post/getNearbyPosts',
            { coordinates: this.coordinates, page: this.postsPage }
          )
          this.nearbyPosts.push(...newNearbyPosts)
          this.postsPage++
          if (newNearbyPosts.length <= 0) {
            this.finished = true
          }
        } else {
          const newNearbyEvents = await this.$store.dispatch(
            'event/getNearbyEvents',
            { coordinates: this.coordinates, page: this.eventsPage }
          )
          this.nearbyEvents.push(...newNearbyEvents)
          this.eventsPage++
          if (newNearbyEvents.length <= 0) {
            this.finished = true
          }
        }
        this.loading = false
      }
    },
    closePlaceSelected() {
      if (this.$refs.postcontent.scrollTop <= 50) {
        this.$emit('back')
      }
    },
    openEditor() {
      this.$router.push({
        name: 'editor',
        query: this.coordinates,
      })
      this.$emit('back')
    },
  },
}
</script>
