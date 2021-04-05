<template lang="pug">
  #portals(v-if="authenticated")
    v-layout(style="overflow-x: scroll")
      v-card.rounded-xl.pa-1.mr-2(color="deep-purple", dark, style="font-size: .7em")
        v-layout(align-center, style="height: 100%")
          v-avatar.mr-2.rounded-xl(tile)
            v-img(src="https://picsum.photos/200")
          div.pr-1
            .font-weight-bold(style="white-space: nowrap") MAR 15 17:30
            span(style="white-space: nowrap") 32 personas
      v-avatar.mr-2.rounded-xl(v-for="(portal, i) in portals", @click="portalsOpened = true", tile, size="62", style="border: 3px solid #F0134D;")
        v-img(:src="portal.profile_picture")
    v-dialog(v-model="portalsOpened")
      expandedPost(v-if="portalsOpened", :type="portals[0].posts[0].type", :content="portals[0].posts[0]")
</template>

<script>
import expandedPost from './expandedPost.vue'
export default {
  components: {
    expandedPost,
  },
  data() {
    return {
      portalsOpened: false,
    }
  },
  computed: {
    authenticated() {
      return this.$store.getters['auth/authenticated']
    },
    portals() {
      return this.$store.state.auth.portals
    },
  },
}
</script>
