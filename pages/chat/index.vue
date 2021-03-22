<template lang="pug">
  #contacts(style="height: 100%")
    v-card(flat, color="primary", tile, dark)
      v-toolbar(color="primary", extended)
        v-btn(icon, small, @click="$router.go(-1)")
          v-icon fas fa-arrow-left
        v-toolbar-title Actividad
        v-spacer
        v-btn(icon)
          v-icon fas fa-search
        template(#extension)
          v-tabs(fixed-tabs)
            v-tab 
              v-chip.text-capitalize(color="white", light) 
                div Chats
                v-chip.ml-2(small, color="primary") {{ total }}
            v-tab.text-capitalize 
              span Cerca de ti
              v-chip.ml-2(small) 15
    v-list
      v-list-item
        v-list-item-avatar
          v-icon(color="primary") fas fa-street-view
        v-list-item-content
          v-list-item-title.font-weight-bold Cerca de ti
        v-list-item-action
          v-chip(color="primary") 15
      v-list-item(v-for="(chat, i) in chats", :key="i", @click="openChat(chat)")
        v-list-item-avatar
          v-img(:src="chat.chat.cover || getMember(chat).profile_picture")
        v-list-item-content
          v-list-item-title.font-weight-bold {{ chat.chat.title || getMember(chat).username }}
        v-list-item-action
          v-chip(v-if="chat.unread != 0", color="primary") {{ chat.unread }}
    v-speed-dial(v-model="dial", absolute, bottom, right)
      template(#activator)
        v-btn(fab, color="primary", dark)
          v-icon {{ dial ? 'fas fa-times' : 'fas fa-pen'}}
      v-btn(fab, @click="newGroup = true")
        v-icon fas fa-user-friends
    v-dialog(v-model="newGroup", fullscreen, hide-overlay, transition="dialog-bottom-transition")
      create-group
</template>

<script>
export default {
  components: {
    createGroup: () => import('@/layouts/createGroup'),
  },
  data() {
    return {
      dial: false,
      newGroup: false,
    }
  },
  computed: {
    chats() {
      return this.$store.state.chat.chats
    },
    total() {
      return this.$store.getters['chat/total']
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
    openChat({ chat }) {
      if (typeof chat.type !== 'undefined' && chat.type === 'group') {
        this.$router.push({ path: `/group/${chat.chat_id}` })
      } else {
        this.$router.push({ path: `/chat/${chat.chat_id}` })
      }
    },
  },
}
</script>
