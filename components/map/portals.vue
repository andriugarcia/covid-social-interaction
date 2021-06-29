<template lang="pug">
  #portals
    v-layout(style="overflow-x: scroll")
      v-btn.mr-2.rounded-xl(v-if="appNotInstalled", fab, depressed, color="primary")
        v-icon fas fa-arrow-circle-down
      v-card.rounded-xl.pa-1.mr-2(v-if="authenticated", color="deep-purple", @click="", dark, style="font-size: .7em")
        v-layout(align-center, style="height: 100%")
          v-avatar.mr-2.rounded-xl(tile)
            v-img(src="https://picsum.photos/200")
          div.pr-1
            .font-weight-bold(style="white-space: nowrap") MAR 15 17:30
            span(style="white-space: nowrap") 32 personas
      v-avatar.mr-2.rounded-xl(v-if="authenticated", v-for="(portal, i) in portals", :key="i", @click="openPortals(i)", tile, size="62", style="border: 3px solid #F0134D;")
        v-img(:src="portal.profile_picture")
    viewer(v-model="portalsOpened")
      v-sheet(color="black", v-touch="{ down: () => portalsOpened = false }", style="height: 100%")
        swiper(ref="portals", :options="swiperOptions", style="height: 100%")
          swiper-slide(v-for="(portal, i) in portals", :key="i", style="height: 100%")
            expandedPost.ma-1.rounded-lg(v-if="portalsOpened", :type="portal.type", :content="portal", style="background-color: white;")
</template>

<script>
import expandedPost from './expandedPost.vue'

export default {
  data() {
    return {
      portalsOpened: false,
      swiperOptions: {
        // effect: 'cube',
        grabCursor: true,
        slidesPerView: 1,
        // spaceBetween: -10,
        // slidesPerGroup: 1,
        loop: true,
      },
    }
  },
  components: {
    expandedPost,
  },
  watch: {
    $route(route) {
      if (route.hash === '') {
        this.portalsOpened = false
      }
    },
  },
  methods: {
    openPortals(i) {
      this.$router.push({ hash: 'portals' })
      this.portalsOpened = true
      // setTimeout(() => {
      //   this.$refs.portals.$swiper.slideTo(i + 1, 0, false)
      // }, 0)
    },
    downloadApp() {
      this.$store.commit('downloadApp')
    },
  },
  computed: {
    authenticated() {
      return this.$store.getters['auth/authenticated']
    },
    portals() {
      return this.$store.state.auth.portals
    },
    appNotInstalled() {
      return this.$store.state.appNotInstalled
    },
  },
  mounted() {},
}
</script>
