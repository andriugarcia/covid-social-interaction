<template lang="pug">
  #profile(v-if="user")
    v-img(src="https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260", max-height="180", alt="alt")
    v-card.mt-n12.rounded-xl(flat)
      v-layout(justify-center, style="position: absolute; top: -40px; left: 0; right: 0;")
        v-avatar(size="80", color="primary")
          v-img(:src="user.profile_picture")
      v-layout.pt-10(justify-center)
        h2 {{ user.username }}
      v-layout(justify-center)
        v-btn(icon, large)
          v-icon.primary--text fab fa-twitter
        v-btn(icon, large)
          v-icon.primary--text fab fa-instagram
        v-btn(icon, large)
          v-icon.primary--text fab fa-snapchat
        v-btn(icon, large)
          v-icon.primary--text fab fa-tiktok
      v-layout.mt-3(column, align-center)
        .font-weight-black {{ user.followers }}
        v-btn(v-if="user.profile_id != me.profile_id", rounded, small, depressed, :outlined="!user.isFollowing", color="primary", @click="follow") {{ user.isFollowing ? 'Siguiendo' : 'OLI 👋🏼'}}
      p.ma-4 Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla
      v-layout.mt-4(justify-center)
        .overline PUBLICACIONES
      masonry.pa-2(:cols="2", :gutter="10")
        post.mb-2(v-for="(publication, i) in posts", :key="i", :type="publication.type", :content="publication", grid)
      
</template>

<script>
import Post from '../components/map/post'

export default {
  components: {
    Post,
  },
  data() {
    return {
      user: null,
      posts: [],
    }
  },
  computed: {
    me() {
      return this.$store.state.auth.user
    },
  },
  async mounted() {
    this.user = await this.$store.dispatch(
      'user/getUser',
      this.$route.params.profile
    )
    this.posts = this.user.post.map((post) => ({
      ...post,
      profile: this.user,
    }))
  },
  methods: {
    follow() {
      if (this.user.isFollowing) {
        this.$store.dispatch('user/unfollow', this.user.profile_id)
        this.user.isFollowing = false
      } else {
        this.$store.dispatch('user/follow', this.user.profile_id)
        this.user.isFollowing = true
      }
    },
  },
}
</script>
