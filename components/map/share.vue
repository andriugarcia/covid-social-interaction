<template lang="pug">
  v-card.pa-4(color="primary", dark)
    .font-weight-bold(style="font-size: 2em") Compartir
    v-layout.py-3(style="overflow-x: scroll;")
      v-card.mr-2.pa-4.rounded-lg.text-center(flat, hover, color="primary darken-1")
        v-icon.mb-2(large, style="display: block; width: 80px;") fab fa-whatsapp
        span Whatsapp
      v-card.mr-2.pa-4.rounded-lg.text-center(flat, hover, color="primary darken-1")
        v-icon.mb-2(large, style="display: block; width: 80px;") fab fa-instagram
        span Instagram
      v-card.mr-2.pa-4.rounded-lg.text-center(flat, hover, color="primary darken-1")
        v-icon.mb-2(large, style="display: block; width: 80px;") fab fa-twitter
        span Twitter
      v-card.mr-2.pa-4.rounded-lg.text-center(flat, hover, color="primary darken-1")
        v-icon.mb-2(large, style="display: block; width: 80px;") fas fa-ellipsis-h
        span Más
    v-text-field.mt-2(light, color="black", filled, rounded, dense, placeholder="Buscar", append-icon="fas fa-search")
    v-list.pb-12(color="primary")
      v-list-item(v-for="(member, i) in people", :key="i", @click="selectMember(member)")
        v-list-item-avatar(color="white")
          v-img(:src="member.cover || member.user.profilePicture")
        v-list-item-title {{ member.title || member.user.username }}
        v-list-item-action
          v-checkbox(:value="member.selected", small, color="white", outlined)
    .pa-4(style="position: absolute; left: 0; right: 0; bottom: 0;")
      v-btn.primary--text(block, rounded, :disabled="selectedList.length == 0", @click="send", :loading="loading", color="white") Enviar {{ selectedList.length != 0 ? '(' + selectedList.length + ')' : '' }}
            
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
      loading: false,
    }
  },
  methods: {
    selectMember(member) {
      if (member.selected) {
        this.selectedList = this.selectedList.filter((e) => e !== member.chatid)
      } else {
        this.selectedList.push(member.chatid)
      }
      member.selected = !member.selected
    },
    async send() {
      this.loading = true
      await this.$store.dispatch('post/share', {
        post: this.post,
        targets: this.selectedList,
      })
      this.loading = false
    },
  },
}
</script>
