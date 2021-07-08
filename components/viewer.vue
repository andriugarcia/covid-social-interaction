<template lang="pug">
#desktop(v-if='$vuetify.breakpoint.mdAndUp')
  v-dialog.rounded-xl(
    v-model='dialogValue',
    :width='500',
    transition='dialog-bottom-transition',
    @click:outside='$emit("click:outside")'
  )
    slot.rounded-xl(style='height: 100%')
#mobile(v-else)
  v-dialog(
    v-model='dialogValue',
    fullscreen,
    transition='dialog-bottom-transition'
  )
    slot
</template>

<script>
export default {
  props: ['value'],
  computed: {
    dialogValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('update', value)
      },
    },
  },
}
</script>
