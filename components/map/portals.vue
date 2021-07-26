<template lang="pug">
#portals
  v-row.flex-nowrap.px-4.pb-5.hide-scrollbar(style='overflow-x: scroll')
    v-btn.mr-2.rounded-xl(
      v-if='appNotInstalled',
      fab,
      depressed,
      color='primary',
      @click='downloadApp'
    )
      v-icon fas fa-arrow-circle-down
    v-card.rounded-xl.pa-1.mr-2(
      v-if='authenticated',
      v-for='(participation, i) in user.participation',
      :key='i',
      :color='getColor(participation.event.emoji)',
      @click.prevent='$router.push({ path: `/events/${participation.event.event_id}` })',
      dark,
      style='font-size: 0.7em'
    )
      v-layout(align-center, style='height: 100%')
        v-avatar.mr-2.rounded-xl(tile, color='white')
          span(style='font-size: 2em') {{ participation.event.emoji }}
        .pr-1
          .text-uppercase.font-weight-bold(style='white-space: nowrap') {{ participation.event.start_date | toDateShort }}
          span(style='white-space: nowrap') Ahora
    v-avatar.mr-2.rounded-xl(
      v-for='(portal, i) in portals',
      :key='i',
      @click.prevent='openPortals(i)',
      color="primary"
      tile,
      size='62',
      style='border: 3px solid #f0134d'
    )
      v-img(:src='portal.profile_picture')
        template(#placeholder)
          v-row.fill-height.ma-0(align='center', justify='center')
            v-progress-circular(indeterminate, color='grey lighten-5')
  viewer(v-model='portalsOpened')
    v-sheet(color="black", style="height: 100%")
      v-carousel(v-if='portalsOpened', v-model="portalIndex", v-touch="{ down: () => portalsOpened = false }", :touchless="focused", :show-arrows="!focused", hide-delimiters, height='100%', continuous, light)
        template(v-slot:prev="{ on, attrs }")
          v-btn(
            fab,
            small,
            depressed,
            color="primary",
            v-bind="attrs"
            v-on="on") 
            v-icon fas fa-chevron-left
        template(v-slot:next="{ on, attrs }")
          v-btn(
            fab,
            small,
            depressed,
            color="primary",
            v-bind="attrs"
            v-on="on") 
            v-icon fas fa-chevron-right
        v-carousel-item(
          v-for='(portal, i) in portals',
          :key='portal.post_id',
          style='height: 100%'
        )
          expandedPost.ma-1.rounded-lg(
            :type='portal.type',
            :content='portal',
            style='background-color: white',
            @focused="focused = true",
            @blured="focused = false"
          )
      //- swiper(ref="portals", :options="swiperOptions", style="height: 100%", virtual, :enabled="false")
        swiper-slide(v-for="(portal, i) in portals", :key="portal.post_id", style="height: 100%", :virtualIndex="portal.post_id")
          expandedPost.ma-1.rounded-lg(v-if="portalsOpened", :type="portal.type", :content="portal", style="background-color: white;")
</template>

<script>
import expandedPost from './expandedPost.vue'
import date from '@/mixins/date'

export default {
  mixins: [date],
  data() {
    return {
      portalIndex: 0,
      portalsOpened: false,
      // swiperOptions: {
      //   // effect: 'cube',
      //   grabCursor: true,
      //   slidesPerView: 1,
      //   // spaceBetween: -10,
      //   // slidesPerGroup: 1,
      //   loop: true,
      // },
      focused: false,
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
      this.portalIndex = i
      this.$router.push({ hash: 'portals' })
      this.portalsOpened = true
      // setTimeout(() => {
      //   this.$refs.portals.$swiper.slideTo(i + 1, 0, false)
      // }, 0)
    },
    downloadApp() {
      this.$store.commit('downloadApp')
    },
    getColor(emoji) {
      return this.$store.state.event.colors[emoji] || 'gray'
    },
  },
  computed: {
    user() {
      console.log(this.$store.state.auth.user)
      return this.$store.state.auth.user
    },
    authenticated() {
      return this.$store.getters['auth/authenticated']
    },
    portals() {
      console.log(this.$store.state.auth.portals)
      return this.$store.state.auth.portals
    },
    appNotInstalled() {
      return this.$store.state.appNotInstalled
    },
  },
  mounted() {},
}
</script>
