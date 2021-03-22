<template lang="pug">
  #imageMap
    component(:is="grid ? 'v-fade-transition' : 'v-scale-transition'") (origin="bottom center 0")
      v-card.card.elevation-3.rounded-lg(v-show="visible", @click.stop="expand")
        image-map(v-if="type == 'image'", :content="content", :grid="grid")
        short-map(v-else-if="type == 'short'", :content="content", :grid="grid")
        video-map(v-else-if="type == 'video'", muted, :content="content", :grid="grid")
        audio-map(v-else-if="type == 'audio'", :content="content", :grid="grid")
        group-map(v-else-if="type == 'group'", :content="content", :grid="grid")
        span(v-else) Format Not Found
        bottom-avatar.bottomalign(v-if="!grid", :src="content.profile_picture")
    v-dialog.rounded-lg(v-model="expanded", width="fit-content", persistent)
      v-layout(justify-center, style="position: fixed; bottom: 12px; left: 0; right: 0;")
        v-card.rounded-pill(style="height: 150px; width: 60px;", color="yellow", @click="expanded = false")
          v-layout(justify-center, align-end, style="height: 100%")
            v-icon.black--text.mb-4 fas fa-times
      v-card.rounded-lg(style="position: absolute; top: 24px; bottom: 82px; right: 0px; left: 0px;", color="black")
        v-layout.pa-4(style="position: absolute; top: 0; left: 0; right: 0;", align-center)
          v-btn(fab, color="primary", @click="$router.push({ path: `/${content.username}` })")
            v-avatar(color="white")
              v-img(:src="content.profile_picture")
          .ml-2(:class="{'white--text': (type != 'short' && type != 'audio')}")
            .font-weight-bold {{content.username}}
            v-layout
              v-chip.mr-2(small, color="purple darken-2", dark)
                v-icon(small) fas fa-glass-cheers
                .ml-2.font-weight-bold Fiesta
              span {{content.created_at | toDate }}
          v-spacer
          v-chip(:color="type != 'short' && type != 'audio' ? 'white' : 'primary'")
            span {{ content.opened }}
            v-icon.ml-1(small) fas fa-eye
        image-map(v-if="expanded && type == 'image'", expanded, :content="content")
        short-map(v-else-if="expanded && type == 'short'", :content="content", expanded)
        video-map(v-else-if="expanded && type == 'video'", expanded, :content="content")
        audio-map(v-else-if="expanded && type == 'audio'", expanded, :content="content")
        .px-2(style="position: absolute; bottom: -20px; left: 0; right: 0;")
          v-layout.px-2(v-if="!authenticated || content.email != user.profile_id")
            v-text-field.mr-3(v-model="message.text", rounded, @keydown.enter="replyMessage", :dark="type != 'short' && type != 'audio'", outlined, placeholder="Escribe un mensaje", color="primary")
              template(#append)
                v-icon(v-if="!!message.text", @click="replyMessage") far fa-paper-plane
            v-btn.mt-3.mr-3(v-if="!message.text", icon, :dark="type != 'short' && type != 'audio'", @click="shareDialog = true")
              v-icon fas fa-share-alt
          v-btn.mb-8(v-else, rounded, block, outlined, :dark="type != 'short' && type != 'audio'")
            span Hacer Permanente
            v-icon.ml-2 far fa-snowflake
    v-bottom-sheet(v-model="shareDialog")
      share(:post="content.post_id")
</template>

<script>
import bottomAvatar from './bottomAvatar.vue'
export default {
  components: {
    bottomAvatar,
    imageMap: () => import('./image.vue'),
    shortMap: () => import('./short.vue'),
    videoMap: () => import('./video.vue'),
    audioMap: () => import('./audio.vue'),
    groupMap: () => import('./group.vue'),
    share: () => import('./share.vue'),
  },

  filters: {
    toDate(value) {
      const date = new Date(value)
      return `${date.getUTCDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    },
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
    shareDialog: false,
    message: {
      userId: '',
      src: null,
      post_ref: '',
      text: '',
      type: 'post',
    },
  }),

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    authenticated() {
      return this.$store.getters['auth/authenticated']
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
      this.expanded = !this.expanded
    },
    async replyMessage() {
      this.message.userId = this.content.profile_id
      this.message.post_ref = this.content.post_id
      await this.$store.dispatch('chat/createMessage', this.message)
      this.$store.commit('setPostCreated', true)
      this.message.userId = ''
      this.message.post_ref = ''
      this.message.text = ''
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
</style>
