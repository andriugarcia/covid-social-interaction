<template lang="pug">
v-card.pa-4(color='primary', dark)
  .font-weight-bold(style='font-size: 2em') Share
  v-layout.py-3(style='overflow-x: scroll')
    v-card.mr-2.pa-2.rounded-lg.text-center(
      flat,
      hover,
      color='primary darken-1',
      @click='share("whatsapp")'
    )
      v-icon.mb-2(style='display: block; width: 80px') fab fa-whatsapp
      span Whatsapp
    v-card.mr-2.pa-2.rounded-lg.text-center(
      flat,
      hover,
      color='primary darken-1',
      @click='share("twitter")'
    )
      v-icon.mb-2(style='display: block; width: 80px') fab fa-twitter
      span Twitter
    v-card.mr-2.pa-2.rounded-lg.text-center(
      v-if='navigatorShareExists()',
      flat,
      hover,
      color='primary darken-1',
      @click='openShare'
    )
      v-icon.mb-2(style='display: block; width: 80px') fas fa-ellipsis-h
      span More
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
      v-if='getMember(member)',
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
      v-if='post',
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
      type: Object,
      default: null,
    },
    event: {
      type: Object,
      default: null,
    },
    group: {
      type: Object,
      default: null,
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

        if (typeof name == 'string') {
          return name.toLowerCase().includes(this.textFilter.toLowerCase())
        } else {
          return false
        }
      })

      return pf
    },
  },
  methods: {
    getMember({ chat }) {
      if (!chat.member) return null
      if (
        chat.member[0].profile.profile_id !==
        this.$store.state.auth.user.profile_id
      ) {
        return chat.member[0].profile
      } else if (chat.member[1]) {
        return chat.member[1].profile
      } else {
        return null
      }
    },
    share(channel) {
      let url = ''
      let type = 'unknown'
      if (this.post) {
        type = 'post'
        url = `http://olimaps.com/?post=${this.post.post_id}`
      } else if (this.event) {
        type = 'event'
        url = `http://olimaps.com/events/${this.event.event_id}`
      } else if (this.group) {
        type = 'group'
        url = `http://olimaps.com/group/${this.group.chat_id}`
      }
      switch (channel) {
        case 'whatsapp':
          this.$fire.analytics.logEvent('share', {
            content_type: type,
            item_id: url,
            method: 'Whatsapp',
          })
          return window.open(
            `whatsapp://send?text=Echale un vistazo a lo que he encontrado! ${url}`
          )
        case 'twitter':
          this.$fire.analytics.logEvent('share', {
            content_type: type,
            item_id: url,
            method: 'Twitter',
          })
          return window.open(
            `https://twitter.com/intent/tweet?text=Echale un vistazo a lo que he encontrado! ${url}`
          )
      }
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
      if (this.post) {
        await this.$store.dispatch('post/share', {
          post: this.post.post_id,
          message: this.message,
          targets: this.selectedList,
        })
      } else if (this.event) {
        await this.$store.dispatch('event/share', {
          event: this.event.event_id,
          targets: this.selectedList,
        })
      } else if (this.group) {
        await this.$store.dispatch('chat/share', {
          chat: this.group.chat_id,
          targets: this.selectedList,
        })
      }
      this.loading = false
      this.$emit('back')
    },
    navigatorShareExists() {
      return typeof navigator.share !== 'undefined'
    },
    openShare() {
      if (this.post) {
        navigator.share({
          title: this.post.profile.username,
          text: this.post.text,
          url: `http://olimaps.com/#${this.post.post_id}`,
        })
      } else if (this.event) {
        navigator.share({
          title: 'Échale un vistazo a este evento',
          text: this.event.title,
          url: `http://olimaps.com/event/${this.event.event_id}`,
        })
      } else if (this.group) {
        navigator.share({
          title: 'Échale un vistazo a este grupo',
          text: this.group.title,
          url: `http://olimaps.com/event/${this.group.chat_id}`,
        })
      }
    },
  },
}
</script>
