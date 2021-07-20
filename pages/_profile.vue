<template lang="pug">
#profile(v-if='user')
  v-card.rounded-xl(
    flat,
    color='white',
    style='height: 100vh; overflow-y: scroll'
  )
    v-layout.px-4.pt-4
      v-btn(icon, color='black', @click='$router.go(-1)')
        v-icon fas fa-arrow-left
    v-layout.mt-4(justify-center)
      v-avatar(size='160', color='primary')
        v-img(:src='user.profile_picture')
    v-layout.px-6.mt-4(align-center)
      div
        .font-weight-bold.ml-2(style='font-size: 1.2em') {{ user.name }}
        span.ml-1 @{{ user.username }}
      v-spacer
      v-btn.mr-2(
        v-if='user.profile_id != me.profile_id',
        fab,
        x-small,
        outlined,
        color='primary',
        @click='openChat'
      )
        v-icon(small) far fa-envelope
      v-btn(
        v-if='user.profile_id != me.profile_id',
        rounded,
        small,
        depressed,
        :outlined='!user.isFollowing',
        color='primary',
        @click='follow'
      ) {{ user.isFollowing ? "Siguiendo" : "OLI 👋🏼" }}
      v-btn(
        v-else,
        rounded,
        small,
        depressed,
        outlined,
        color='primary',
        @click='editingProfile = true'
      ) Editar Perfil
    v-layout.px-4.mt-6(justify-center, wrap)
      div(v-for='(rrss, i) in user.rrss', :key='i')
        v-chip.mr-1.mb-1(
          v-if='rrss.type == "twitter"',
          color='white darken-1',
          @click='openWindow("https://twitter.com/" + rrss.name)'
        )
          v-icon(small) fab fa-twitter
          span.ml-1 @{{ rrss.name }}
        v-chip.mr-1.mb-1(
          v-else-if='rrss.type == "instagram"',
          color='white darken-1',
          @click='openWindow("https://instagram.com/" + rrss.name)'
        )
          v-icon(small) fab fa-instagram
          span.ml-1 {{ rrss.name }}
        v-chip.mr-1.mb-1(
          v-else-if='rrss.type == "snapchat"',
          color='white darken-1',
          @click='openWindow("https://snapchat.com/add/" + rrss.name)'
        )
          v-icon(small) fab fa-snapchat
          span.ml-1 {{ rrss.name }}
        v-chip.mr-1.mb-1(
          v-else-if='rrss.type == "tiktok"',
          color='white darken-1',
          @click='openWindow("https://tiktok.com/@/" + rrss.name)'
        )
          v-icon(small) fab fa-tiktok
          span.ml-1 @{{ rrss.name }}
        v-chip.mr-1.mb-1(
          v-else-if='rrss.type == "facebook"',
          color='white darken-1',
          @click='openWindow("https://facebook.com/" + rrss.name)'
        )
          v-icon(small) fab fa-facebook
          span.ml-1 {{ rrss.name }}
        v-chip.mr-1.mb-1(
          v-else-if='rrss.type == "web"',
          color='white darken-1',
          @click='openWindow(rrss.name)'
        )
          span.ml-1 {{ rrss.name }}
    .mt-4.ml-4.font-weight-black {{ user.followers }} seguidores
    p.ma-4 {{ user.description }}
    .ma-4
      .overline(v-if='user.groups.length !== 0') PARTICIPANDO EN:
      v-layout(wrap)
        v-chip.pl-0.pr-2.mb-1.mr-1(
          v-for='(group, i) in user.groups',
          :key='i',
          outlined,
          @click='$router.push("/group/" + group.chat.chat_id)'
        )
          v-avatar.mr-1(size='32')
            v-img(:src='group.chat.cover')
          span {{ group.chat.title }}
    v-tabs(
      v-model='tab',
      fixed-tabs,
      background-color='white',
      style='position: sticky; top: 0; left: 0; right: 0; z-index: 10'
    )
      v-tab(key='posts') Posts
      v-tab(key='events') Eventos
    v-tabs-items(v-model='tab', style='background-color: transparent')
      v-tab-item(key='posts')
        masonry.pa-2(v-if='posts.length != 0', :cols='2', :gutter='10')
          post.mb-2(
            v-for='(publication, i) in posts',
            :key='i',
            :type='publication.type',
            :content='publication',
            grid
          )
      v-tab-item(key='events')
    v-dialog(:value='sendMessage', fullscreen, transition='fade-transition')
      v-sheet(
        color='#1e1e1eE0',
        style='position: relative; width: 100%; height: 100%'
      )
        new-chat(:user='user', @back='sendMessage = false')
  viewer(v-model='editingProfile')
    edit-profile(@back='editFinished')
</template>

<script>
import Post from '../components/map/post'

export default {
  components: {
    Post,
    NewChat: () => import('@/layouts/newChat'),
    editProfile: () => import('@/components/profile/editProfile'),
  },
  data() {
    return {
      user: null,
      posts: [],
      editingProfile: false,
      tab: 'posts',
      sendMessage: false,
    }
  },
  computed: {
    me() {
      return this.$store.state.auth.user
    },
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      this.user = await this.$store.dispatch(
        'user/getUser',
        this.$route.params.profile
      )

      this.posts = this.user.post.map((post) => ({
        ...post,
        profile: this.user,
      }))
    },
    openChat() {
      const chatId = this.$store.getters['chat/getChatIdFromUsername'](
        this.$route.params.profile
      )

      console.log(chatId)

      if (chatId !== null) {
        this.$router.push({ path: `chat/${chatId}` })
      } else {
        this.sendMessage = true
      }
    },
    follow() {
      if (this.user.isFollowing) {
        this.$store.dispatch('user/unfollow', this.user.profile_id)
        this.user.isFollowing = false
      } else {
        this.$store.dispatch('user/follow', this.user.profile_id)
        this.user.isFollowing = true
      }
    },
    editFinished() {
      this.getUser()
      this.editingProfile = false
    },
    openWindow(url) {
      window.open(url)
    },
  },
}
</script>
