<template lang="pug">
  #avatar-group
    v-layout(align-center, justify-end)
      v-avatar.avatar.rounded-circle(size="32", v-for="(avatar, i) in avatars", :key="i")
        v-img(v-if="i <= limit", :src="avatar")
      v-chip.ml-1(color="primary lighten-5") 
        .black--text {{ avatars.length | upLimit }}
</template>

<script>
export default {
  filters: {
    upLimit(value) {
      return value > 99 ? '+99' : value
    },
  },
  props: {
    avatars: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: 6,
    },
  },
}
</script>

<style lang="scss" scoped>
$margin-left: -16px;
$radial: 16px;
$at: 1px;

.avatar {
  display: inline-block;
  overflow: hidden;
}

.avatar:not(:first-child) {
  margin-left: $margin-left;
  -webkit-mask: radial-gradient(
    circle $radial at $at 50%,
    transparent 99%,
    #fff 100%
  );
  mask: radial-gradient(circle $radial at $at 50%, transparent 99%, #fff 100%);
}

.avatar img {
  width: 100%;
  display: block;
}
</style>
