<template lang="pug">
  #profile
    v-img(src="https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260", max-height="320", alt="alt")
    v-card.mt-n8.rounded-xl(flat)
      v-layout(justify-center, style="position: absolute top: -40px left: 0 right: 0")
        v-avatar(size="80")
          v-img(src="https://picsum.photos/200")
      v-layout.pt-10(justify-center)
        h2 Name
      v-layout(justify-center)
        v-btn(icon)
          v-icon mdi-twitter
        v-btn(icon)
          v-icon mdi-instagram
        v-btn(icon)
          v-icon mdi-snapchat
      
      v-layout.mt-4(justify-center)
        .overline PUBLICACIONES
      .masonry
        post.mb-2(type="short", grid)
        post.mb-2(type="video", grid)
        post.mb-2(type="image", grid)
        post.mb-2(type="short", grid)
        post.mb-2(type="video", grid)
        post.mb-2(type="image", grid)
        post.mb-2(type="video", grid)
        post.mb-2(type="image", grid)
        post.mb-2(type="short", grid)
        post.mb-2(type="short", grid)
        post.mb-2(type="video", grid)
        post.mb-2(type="image", grid)
        post.mb-2(type="video", grid)
        post.mb-2(type="short", grid)
        post.mb-2(type="short", grid)
        post.mb-2(type="image", grid)
        post.mb-2(type="video", grid)
        post.mb-2(type="image", grid)
        post.mb-2(type="short", grid)
        post.mb-2(type="video", grid)
        post.mb-2(type="short", grid)
        post.mb-2(type="image", grid)
      
</template>

<script>
import Post from '../map/post'

export default {
  components: {
    Post,
  },
}
</script>

<style>
.masonry {
  column-count: 2;
  column-gap: 1em;
}
</style>
