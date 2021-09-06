<template lang="pug">
  #postMap
    #group(v-if="type == 'group'")
      .text-center(@click.stop="$router.push({ path: `/group/${content.chat_id}` })")
        v-avatar.elevation-2(size="40")
          img(:src="content.cover")
        v-card.px-1.text-center.rounded-pill(outlined, style='max-width: 120px')
          span.mx-1.font-weight-bold {{ content.title }}
      v-layout(justify-center)
        .triangle
    #event(v-else-if="type == 'event'")
      v-card.ml-n2.rounded-lg(outlined, style="height: fit-content; min-width: 140px; max-width: 200px;", @click.stop="$router.push({ path: `/events/${content.event_id}`})")
        v-layout(fill-height)
          v-sheet.rounded-lg(:color="getColor()", style="min-height: 40px;")
            v-layout.px-1(align-center, style='height: 100%')
              span(style='font-size: 2em') {{ content.emoji }}
          .mx-2.py-1
            div.font-weight-medium.text-truncate(style='font-size: 0.8em; line-height: 1.4; max-width: 120px;') {{ content.title }}
            div.font-weight-light(style='font-size: 0.8em;') {{ content.start_date | toDateShort }}
      v-layout(justify-center)
        .triangle
    div(v-else)
      transition(name="scale")
        v-card.card.rounded-lg(v-show="visible", outlined, @click.stop="expand", width="100%")
          image-map(v-if="type == 'image'", :content="content", :grid="grid")
          short-map(v-else-if="type == 'short'", :content="content", :grid="grid")
          video-map(v-else-if="type == 'video'", muted, :content="content", :grid="grid")
          audio-map(v-else-if="type == 'audio'", :content="content", :grid="grid")
          group-map(v-else-if="type == 'group'", :content="content", :grid="grid")
          span(v-else) Format Not Found
          bottom-avatar.bottomalign(v-if="!grid", :src="content.profile_picture || content.profile.profile_picture")
      viewer(v-model="expanded", @click:outside="closePost")
        expanded-post(v-if="expanded", :type="type", v-touch="{ down: () => closePost() }", :content="content", @back="closePost")
</template>

<script>
import bottomAvatar from './bottomAvatar.vue'
import expandedPost from './expandedPost.vue'
import date from '@/mixins/date'

export default {
  mixins: [date],
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
      if (
        typeof route.query.post === 'undefined' &&
        typeof route.query.search === 'undefined'
      ) {
        this.expanded = false
      }
    },
  },

  mounted() {
    setTimeout(() => {
      this.visible = true
    }, 0)
  },
  destroyed() {
    this.visible = false
  },
  methods: {
    expand() {
      this.$router.push({
        query: {
          post: this.content.post_id,
        },
      })
      this.expanded = true
    },
    closePost() {
      this.$router.replace({ query: {} })
      this.expanded = false
    },
    getColor() {
      return (
        (this.$store.state.event.colors[this.content.emoji] || 'gray') +
        ' lighten-3'
      )
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

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}
.scale-enter {
  opacity: 0;
  transform: translate(0, 5px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter {
  opacity: 0;
  transform: translate(0, 5px);
}
</style>
