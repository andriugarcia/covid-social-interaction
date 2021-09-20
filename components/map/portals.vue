<template lang="pug">
#portals
  .flex-nowrap.align-center.hide-scrollbar(ref='scrollarea', style='overflow-x: scroll; display: flex;')
    v-card.rounded-xl.pa-1.mr-2(
      v-if='appNotInstalled',
      depressed,
      dark,
      color='primary',
      @click='downloadApp',
      style='height: 56px'
    )
      v-layout(style='height: 100%', align-center)
        v-icon.mx-2(color='white', size='32') fas fa-arrow-circle-down
        span.font-weight-bold(style='font-size: 0.7em; width: 70px;') INSTALAR OLIMAPS
    v-card.rounded-xl.pa-1.pr-3.mr-2(
      v-if='authenticated && i < 2',
      v-for='(participation, i) in user.participation',
      :key='i',
      :color='getColor(participation.event.emoji)',
      @click.prevent='$router.push({ path: `/events/${participation.event.event_id}` })',
      dark,
      flat,
      style='font-size: 0.7em; max-width: 180px;'
    )
      v-layout(align-center, style='height: 100%')
        v-avatar.mr-2.rounded-xl(tile, color='white')
          span(style='font-size: 2em') {{ participation.event.emoji }}
        .pr-1
          .text-uppercase.font-weight-bold(style='white-space: nowrap') {{ participation.event.start_date | toDateShort }}
          span {{ participation.event.title | truncate }}
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
    .mx-2(v-if='loading')
      v-progress-circular(indeterminate, color='primary')
  viewer(v-model='portalsOpened')
    v-sheet(color="black", style="height: 100%")
      v-carousel(v-if='portalsOpened', v-model="portalIndex", v-touch="{ down: () => closePortals() }", :touchless="focused", :show-arrows="!focused", hide-delimiters, height='100%', continuous, light)
        template(v-slot:prev="{ on, attrs }")
          v-btn(
            fab,
            small,
            depressed,
            v-bind="attrs",
            v-on="on") 
            v-icon.primary--text fas fa-chevron-left
        template(v-slot:next="{ on, attrs }")
          v-btn(
            fab,
            small,
            depressed,
            v-bind="attrs",
            v-on="on") 
            v-icon.primary--text fas fa-chevron-right
        v-carousel-item(
          v-for='(portal, i) in portals',
          :key='portal.post_id',
          style='height: 100%'
        )
          expandedPost.rounded-lg(
            :type='portal.type',
            :content='portal',
            style='background-color: white',
            @focused="focused = true",
            @blured="focused = false",
            @back='closePortals'
          )
      //- swiper(ref="portals", :options="swiperOptions", style="height: 100%", virtual, :enabled="false")
        swiper-slide(v-for="(portal, i) in portals", :key="portal.post_id", style="height: 100%", :virtualIndex="portal.post_id")
          expandedPost.ma-1.rounded-lg(v-if="portalsOpened", :type="portal.type", :content="portal", style="background-color: white;")
</template>

<script>
import expandedPost from './expandedPost.vue'
import date from '@/mixins/date'
import push from '@/mixins/push'

export default {
  mixins: [date, push],
  data() {
    return {
      portalIndex: 0,
      page: 1,
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
      loading: false,
      finished: false,
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
    portalIndex(value) {
      if (!this.loading && value + 3 >= this.portals.length) {
        this.getFollowingPortals()
      }
    },
  },
  filters: {
    truncate(value) {
      const limit = 24
      if (value.length > limit) return value.substr(0, limit) + '...'
      return value
    },
  },
  methods: {
    closePortals() {
      this.$router.replace({ hash: '' })
      this.portalsOpened = false
    },
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
      return this.$store.state.event.colors[emoji] || 'primary'
    },
    async handleScroll() {
      const length = this.portals.length
      if (
        !this.loading &&
        !this.finished &&
        this.$refs.scrollarea.scrollLeft + 500 >=
          this.$refs.scrollarea.scrollWidth
      ) {
        await this.getFollowingPortals()
      }
    },
    async getFollowingPortals() {
      this.loading = true

      await this.$store.dispatch('auth/getPortals', this.page)
      this.finished = length == this.portals.length

      this.page++
      this.loading = false
    },
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
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
  mounted() {
    this.$refs.scrollarea.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    this.$refs.scrollarea.removeEventListener('scroll', this.handleScroll)
  },
}
</script>
