<template lang="pug">
  #contacts(style="height: 100%")
    v-card(flat, color="text", tile, dark)
      v-layout.pa-2(justify-space-between)
        v-btn(icon, small, @click="$router.go(-1)")
          v-icon fas fa-arrow-left
        v-btn.text-capitalize(outlined, rounded, small, @click="newGroup = true") Nuevo Grupo
      v-text-field.mx-2.mt-4(solo, color="background", dense, placeholder="Buscar", append-icon="fas fa-search")
    v-card(flat, color="yellow")
      v-tabs(fixed-tabs)
        v-tab 
          v-chip.text-capitalize(color="primary") 
            div Chats
            v-chip.ml-2(small) {{ total }}
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
          v-img(:src="chat.cover || chat.user.profilePicture")
        v-list-item-content
          v-list-item-title.font-weight-bold {{ chat.title || chat.user.username }}
        v-list-item-action
          v-chip(v-if="chat.unread != 0", color="primary") {{ chat.unread }}
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
    openChat(chat) {
      if (typeof chat.type !== 'undefined' && chat.type === 'group') {
        this.$router.push({ path: `/group/${chat.chatid}` })
      } else {
        this.$router.push({ path: `/chat/${chat.user.username}` })
      }
    },
  },
}
</script>
