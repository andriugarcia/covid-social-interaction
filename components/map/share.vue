<template lang="pug">
v-card.pa-4(color='primary', dark)
  .font-weight-bold(style='font-size: 2em') Compartir
  v-layout.py-3(style='overflow-x: scroll')
    v-card.mr-2.pa-4.rounded-lg.text-center(
      flat,
      hover,
      color='primary darken-1',
      @click='mark'
    )
      v-icon.mb-2(large, style='display: block; width: 80px') far fa-bookmark
      span Guardar
    v-card.mr-2.pa-4.rounded-lg.text-center(
      flat,
      hover,
      color='primary darken-1',
      @click='share("whatsapp")'
    )
      v-icon.mb-2(large, style='display: block; width: 80px') fab fa-whatsapp
      span Whatsapp
    v-card.mr-2.pa-4.rounded-lg.text-center(
      flat,
      hover,
      color='primary darken-1',
      @click='share("twitter")'
    )
      v-icon.mb-2(large, style='display: block; width: 80px') fab fa-twitter
      span Twitter
    v-card.mr-2.pa-4.rounded-lg.text-center(
      v-if='navigatorShareExists()',
      flat,
      hover,
      color='primary darken-1',
      @click='openShare'
    )
      v-icon.mb-2(large, style='display: block; width: 80px') fas fa-ellipsis-h
      span Más
  v-text-field.mt-2(
    v-model='textFilter',
    hide-details,
    light,
    color='black',
    filled,
    rounded,
    dense,
    placeholder='Buscar',
    append-icon='fas fa-search'
  )
  v-list(
    color='primary',
    style='max-height: 50vh; overflow-y: scroll; padding-bottom: 100px'
  )
    v-list-item(
      v-for='(member, i) in peopleFiltered',
      :key='i',
      @click='selectMember(member)'
    )
      v-list-item-avatar(color='white')
        v-img(:src='member.chat.cover || getMember(member).profile_picture')
      v-list-item-title {{ member.chat.title || getMember(member).username }}
      v-list-item-action
        v-checkbox(:value='member.selected', small, color='white', outlined)
  v-card.pa-4(
    color='primary',
    style='position: absolute; left: 0; right: 0; bottom: 0'
  )
    v-text-field.mb-2(
      v-model='message',
      hide-details,
      light,
      color='black',
      filled,
      dense,
      placeholder='Añade un comentario'
    )
    v-btn.primary--text(
      block,
      rounded,
      :disabled='selectedList.length == 0',
      @click='send',
      :loading='loading',
      color='white'
    ) Enviar {{ selectedList.length != 0 ? "(" + selectedList.length + ")" : "" }}
</template>

<script>
export default {
  props: {
    post: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      people: this.$store.state.chat.chats.map((chat) => ({
        ...chat,
        selected: false,
      })),
      selectedList: [],
      message: null,
      textFilter: '',
      loading: false,
    }
  },
  computed: {
    peopleFiltered() {
      if (this.textFilter.length === 0) {
        return this.people
      }
      const pf = this.people.filter((member) => {
        const name = member.chat.title || this.getMember(member).username

        return name.toLowerCase().includes(this.textFilter.toLowerCase())
      })

      return pf
    },
  },
  methods: {
    getMember({ chat }) {
      if (
        chat.member[0].profile.profile_id !==
        this.$store.state.auth.user.profile_id
      ) {
        return chat.member[0].profile
      } else {
        return chat.member[1].profile
      }
    },
    share(channel) {
      switch (channel) {
        case 'whatsapp':
          return window.open(
            `whatsapp://send?text=Echale un vistazo a lo que he encontrado! http://olimaps.com/post/${this.post.post_id}`
          )
        case 'twitter':
          return window.open(
            `https://twitter.com/intent/tweet?text=Echale un vistazo a lo que he encontrado! http://olimaps.com/post/${this.post.post_id}`
          )
      }
    },
    mark() {
      this.$store.dispatch('post/save', this.post.post_id)
    },
    selectMember(member) {
      if (member.selected) {
        this.selectedList = this.selectedList.filter(
          (e) => e !== member.chat_id
        )
      } else {
        this.selectedList.push(member.chat_id)
      }
      member.selected = !member.selected
    },
    async send() {
      this.loading = true
      await this.$store.dispatch('post/share', {
        post: this.post.post_id,
        message: this.message,
        targets: this.selectedList,
      })
      this.loading = false
      this.$emit('back')
    },
    navigatorShareExists() {
      return typeof navigator.share !== 'undefined'
    },
    openShare() {
      navigator.share({
        title: this.post.profile.username,
        text: this.post.text,
        url: `http://olimaps.com/#${this.post.post_id}`,
      })
    },
  },
}
</script>
