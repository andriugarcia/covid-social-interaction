<template lang="pug">
  #imageMap
    v-card.card.elevation-3.rounded-lg(@click.stop="expand")
      image-map(v-if="type == 'image'", :content="content", :grid="grid")
      short-map(v-else-if="type == 'short'", :content="content", :grid="grid")
      video-map(v-else-if="type == 'video'", muted, :content="content", :grid="grid")
      span(v-else) Format Not Found
      bottom-avatar.bottomalign(v-if="!grid", :src="content.author.profilePicture")
    v-dialog.rounded-lg(v-model="expanded", width="fit-content", persistent)
      v-card.rounded-lg(style="position: relative")
        v-layout.pa-4(style="position: absolute top: 0 left: 0 right: 0")
          v-avatar
            v-img(:src="content.author.profilePicture")
          .ml-2(:class="{'white--text': type != 'short'}")
            .font-weight-bold {{content.author.username}}
            span {{content.createdAt | toDate }}
        image-map(v-if="expanded && type == 'image'", expanded, :content="content")
        short-map(v-else-if="expanded && type == 'short'", :content="content", expanded)
        video-map(v-else-if="expanded && type == 'video'", expanded, :content="content")
        v-layout.px-2(style="position: absolute bottom: -20px left: 0 right: 0")
          v-text-field.mr-3(rounded, :dark="type != 'short'", outlined, placeholder="Escribe un mensaje", color="primary", prepend-inner-icon="far fa-smile", append-icon="far fa-paper-plane")
          v-btn.mt-3.mr-3(icon, :dark="type != 'short'")
            v-icon fas fa-share-alt
      v-layout(justify-center, style="position: fixed bottom: 12px left: 0 right: 0")
        v-btn(fab, @click="expanded = false")
          v-icon fas fa-times
</template>

<script>
import bottomAvatar from './bottomAvatar.vue'
export default {
  components: {
    bottomAvatar,
    imageMap: () => import('./image.vue'),
    shortMap: () => import('./short.vue'),
    videoMap: () => import('./video.vue'),
  },

  filters: {
    toDate(value) {
      const date = new Date(value * 1)
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
  }),

  methods: {
    expand() {
      this.expanded = !this.expanded
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
