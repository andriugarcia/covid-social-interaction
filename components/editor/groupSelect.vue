<template lang="pug">
  #groupSelect(style="height: 100%")
    v-toolbar(color="primary", dark)
      v-btn(icon, @click="$emit('back')")
        v-icon fas fa-arrow-left
      v-toolbar-title Seleccionar Grupo
    v-card(flat, style="height: 100%")
      v-list
        v-list-item(@click="selectGroup(null)")
          v-list-item-avatar
            v-icon fas fa-times
          v-list-item-title Ningún Grupo
        v-list-item(v-for="(group, i) in groups", @click="selectGroup(group)")
          v-list-item-avatar(color="primary")
            v-img(:src="group.chat.cover")
          v-list-item-title {{ group.chat.title }}
          
</template>

<script>
export default {
  data() {
    return {
      groups: [],
    }
  },
  async mounted() {
    this.groups = await this.$store.dispatch('chat/getGroupsAdmin')
  },
  methods: {
    selectGroup(group) {
      this.$emit('selected', group)
      this.$emit('back')
    },
  },
}
</script>
