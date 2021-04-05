<template lang="pug">
  #imageMap
    #group(v-if="type == 'group'")
      v-card.rounded-pill(@click="$router.push({ path: `/join/${content.chat_id}` })")
        v-avatar(size="40")
          v-img(:src="content.cover")
        span.mx-1.font-weight-bold {{ content.title }}
      v-layout(justify-center)
        .triangle
    #event(v-else-if="type == 'event'")
      v-card.pa-1.rounded-pill(dark, @click="$router.push({ path: `/events/${content.event_id}`})", :color="categories[content.category].color")
        v-icon.mx-1(small) {{ categories[content.category].icon }}
        span.mx-1.font-weight-bold {{ content.title }}
      v-layout(justify-center)
        .triangle
    div(v-else)
      component(:is="grid ? 'v-fade-transition' : 'v-scale-transition'", origin="bottom center 0")
        v-card.card.elevation-3.rounded-lg(v-show="visible", @click.stop="expand")
          image-map(v-if="type == 'image'", :content="content", :grid="grid")
          short-map(v-else-if="type == 'short'", :content="content", :grid="grid")
          video-map(v-else-if="type == 'video'", muted, :content="content", :grid="grid")
          audio-map(v-else-if="type == 'audio'", :content="content", :grid="grid")
          group-map(v-else-if="type == 'group'", :content="content", :grid="grid")
          span(v-else) Format Not Found
          bottom-avatar.bottomalign(v-if="!grid", :src="content.profile_picture || content.profile.profile_picture")
      v-dialog.rounded-lg(v-model="expanded", width="fit-content", persistent)
        v-layout(justify-center, style="position: fixed; bottom: 12px; left: 0; right: 0;")
          v-card.rounded-pill(style="height: 150px; width: 60px;", color="yellow", @click="closePost")
            v-layout(justify-center, align-end, style="height: 100%")
              v-icon.black--text.mb-4 fas fa-times
        expanded-post(:type="type", :content="content")
</template>

<script>
import bottomAvatar from './bottomAvatar.vue'
import expandedPost from './expandedPost.vue'

export default {
  components: {
    bottomAvatar,
    imageMap: () => import('./image.vue'),
    shortMap: () => import('./short.vue'),
    videoMap: () => import('./video.vue'),
    audioMap: () => import('./audio.vue'),
    groupMap: () => import('./group.vue'),
    expandedPost,
  },

  props: {
    type: {
      type: String,
      default: 'none',
    },
    content: {
      type: Object,
      default: () => ({}),
    },
    grid: Boolean,
  },

  data: () => ({
    expanded: false,
    visible: false,
  }),

  computed: {
    categories() {
      return this.$store.state.event.categories
    },
  },

  watch: {
    $route(route) {
      if (route.hash === '') {
        this.expanded = false
      }
    },
  },

  mounted() {
    this.visible = true
  },
  destroyed() {
    this.visible = false
  },
  methods: {
    expand() {
      this.$router.push({ hash: this.content.post_id })
      this.expanded = true
      this.$store.dispatch('post/openPost', this.content.post_id)
    },
    closePost() {
      this.$router.replace({ hash: '' })
      this.expanded = false
    },
  },
}
</script>

<style scoped>
.bottomalign {
  position: absolute;
  bottom: -14px;
  left: 0;
  right: 0;
}

.card {
  width: fit-content;
  height: fit-content;
}

.triangle {
  width: 0;
  height: 0;
  border-bottom: 0 solid black;
  border-top: 9px solid black;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
}
</style>
