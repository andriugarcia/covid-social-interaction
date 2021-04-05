<template lang="pug">
  #expanded
    v-card.rounded-lg(style="position: absolute; top: 8px; bottom: 62px; right: 0px; left: 0px;", color="black")
      v-layout.pa-4(style="position: absolute; top: 0; left: 0; right: 0;", align-center)
        v-btn(fab, color="primary", @click="$router.push({ path: `/${content.username || content.profile.username}` })")
          v-avatar(color="white")
            v-img(:src="content.profile_picture || content.profile.profile_picture")
        .ml-2(:class="{'white--text': (type != 'short' && type != 'audio')}")
          .font-weight-bold {{content.username || content.profile.username}}
          v-layout
            v-chip.mr-2(small, color="purple darken-2", dark)
              v-icon(small) fas fa-glass-cheers
              .ml-2.font-weight-bold Fiesta
            span {{content.created_at | toDate }}
        v-spacer
        v-chip(:color="type != 'short' && type != 'audio' ? 'white' : 'primary'")
          span {{ content.opened }}
          v-icon.ml-1(small) fas fa-eye
      image-map(v-if="type == 'image'", expanded, :content="content")
      short-map(v-else-if="type == 'short'", :content="content", expanded)
      video-map(v-else-if="type == 'video'", expanded, :content="content")
      audio-map(v-else-if="type == 'audio'", expanded, :content="content")
      .px-2.pb-4(style="position: absolute; bottom: 0px; left: 0; right: 0;")
        v-layout.px-2(align-center, justify-space-between)
          v-text-field(ref="replyTextField", v-if="!authenticated || content.profile_id != user.profile_id", v-model="message.text", rounded, @keydown.enter="replyMessage", :dark="type != 'short' && type != 'audio'", outlined, placeholder="Escribe un mensaje", color="primary", hide-details)
            template(#append)
              v-icon(v-if="!!message.text", @click="replyMessage") far fa-paper-plane
          div
          v-btn.mx-3(v-if="!message.text", icon, :dark="type != 'short' && type != 'audio'", @click="openShare")
            v-icon fas fa-share-alt
        //- v-layout(v-else)
          v-btn.mb-8(rounded, outlined, :dark="type != 'short' && type != 'audio'")
            span Hacer Permanente
            v-icon.ml-2 far fa-snowflake
    v-bottom-sheet(v-model="shareDialog")
      share(:post="content.post_id", @back="shareDialog = false")
</template>

<script>
export default {
  components: {
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
  data() {
    return {
      shareDialog: false,
      message: {
        userId: '',
        src: null,
        post_ref: '',
        text: '',
        type: 'post',
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    authenticated() {
      return this.$store.getters['auth/authenticated']
    },
  },
  watch: {
    $route(route) {
      if (route.hash === '#' + this.content.post_id) {
        this.shareDialog = false
      }
    },
  },
  methods: {
    async replyMessage() {
      this.message.userId = this.content.profile_id
      this.message.post_ref = this.content.post_id
      await this.$store.dispatch('chat/createMessage', this.message)
      this.$store.commit('setPostCreated', true)
      this.message.userId = ''
      this.message.post_ref = ''
      this.message.text = ''

      this.$refs.replyTextField.blur()
    },
    openShare() {
      this.shareDialog = true
      this.$router.push({ hash: 'share' })
    },
  },
}
</script>
