<template lang="pug">
  #contacts(style="height: 100%")
    v-card(flat, color="primary", tile, dark)
      v-toolbar.px-2(v-if="!searchEnabled", color="primary", extended)
        v-btn(icon, small, @click="$router.go(-1)")
          v-icon fas fa-arrow-left
        v-toolbar-title Mensajes
        v-spacer
        v-btn(icon, @click="searchEnabled = true")
          v-icon fas fa-search
        template(#extension)
          v-tabs(v-model="tab", fixed-tabs)
            v-tab(key="chats") 
              div Chats
              v-chip.primary--text.ml-2(v-show="total != 0", small, color="white") {{ total }}
            v-tab(key="close") 
              div Grupos Cerca
              v-chip.primary--text.ml-2(v-show="totalClose != 0", small, color="white") {{ totalClose }}
      v-toolbar(v-else, color="primary")
        v-text-field(prepend-icon="fas fa-arrow-left", placeholder="Buscar", hide-details, v-model="textFilter", @click:prepend="disableSearch")
    v-tabs-items(v-model="tab")
      v-tab-item(key="chats")
        v-list
          v-list-item(v-for="(chat, i) in chats", :key="i", @click="openChat(chat)")
            v-list-item-avatar
              v-img(:src="chat.chat.cover || getMember(chat).profile_picture")
            v-list-item-content
              v-list-item-title.font-weight-bold {{ chat.chat.title || getMember(chat).username }}
            v-list-item-action
              v-chip(v-if="chat.unread != 0", color="primary") {{ chat.unread }}
      v-tab-item(key="close")
        v-list
          v-list-item
            v-list-item-avatar
              v-icon(color="primary") fas fa-street-view
            v-list-item-content
              v-list-item-title.font-weight-bold Cerca de ti
            v-list-item-action
              v-chip(color="primary") 15
          v-list-item(v-for="(chat, i) in closeChats", :key="i", @click="joinChat(chat)")
            v-list-item-avatar
              v-img(:src="chat.cover")
            v-list-item-content
              v-list-item-title.font-weight-bold {{ chat.title }}
              v-list-item-subtitle a {{haversineDistance([userPosition.lat, userPosition.lng], [chat.coordinates.lat, chat.coordinates.lng])}}km, {{ chat.members }} miembros
            v-list-item-action
              //- v-chip(v-if="chat.unread != 0", color="primary") {{ chat.unread }}
      v-speed-dial(v-model="dial", fixed, bottom, right)
        template(#activator)
          v-btn(fab, color="primary", dark)
            v-icon {{ dial ? 'fas fa-times' : 'fas fa-pen'}}
        v-btn(fab, @click="newGroup = true")
          v-icon fas fa-user-friends
    v-dialog(v-model="newGroup", fullscreen, hide-overlay, transition="dialog-bottom-transition")
      create-group
</template>

<script>
import geo from '@/mixins/geo'
export default {
  components: {
    createGroup: () => import('@/layouts/createGroup'),
  },
  mixins: [geo],
  data() {
    return {
      dial: false,
      newGroup: false,
      tab: 'chat',
      searchEnabled: false,
      textFilter: '',
    }
  },
  computed: {
    chats() {
      if (!this.$store.getters['auth/authenticated'])
        this.$router.replace({ path: '/' })
      return this.$store.state.chat.chats.filter((chat) =>
        (chat.chat.title || this.getMember(chat).username)
          .toLowerCase()
          .includes(this.textFilter.toLowerCase())
      )
    },
    closeChats() {
      return this.$store.state.chat.closeChats
    },
    total() {
      return this.$store.getters['chat/total']
    },
    totalClose() {
      return this.$store.getters['chat/totalClose']
    },
    userPosition() {
      return this.$store.state.map.userPosition
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
    disableSearch() {
      this.textFilter = ''
      this.searchEnabled = false
    },
    openChat({ chat }) {
      if (typeof chat.type !== 'undefined' && chat.type === 'group') {
        this.$router.push({ path: `/group/${chat.chat_id}` })
      } else {
        this.$router.push({ path: `/chat/${chat.chat_id}` })
      }
    },
    joinChat(chat) {
      this.$router.push({ path: `/join/${chat.chat_id}` })
    },
  },
}
</script>
