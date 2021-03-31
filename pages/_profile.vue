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
        .font-weight-black 3.2M
        v-btn(rounded, small, outlined, color="primary") OLI 👋🏼
      p.ma-4 Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla
      v-layout.mt-4(justify-center)
        .overline PUBLICACIONES
      .masonry.pa-2
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
}
</script>

<style>
.masonry {
  column-count: 2;
  column-gap: 1em;
}
</style>
