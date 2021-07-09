<template lang="pug">
#signup
  v-layout.pt-3(justify-center, align-center)
    img(src='@/assets/olimaps-logo.png', style='width: 36px; height: 36px')
    img(src='@/assets/olimaps-logo-light.png', style='height: 30px')
  .pa-6(v-if='step == 1')
    .font-weight-black.overline CREAR CUENTA CON
    v-btn.rounded-lg(outlined, large, block)
      v-layout(align-center)
        v-icon.mr-2 far fa-envelope
        .text-capitalize Correo o Teléfono
    v-btn.mt-4.rounded-lg(outlined, large, block, disabled)
      v-layout(align-center)
        v-icon.mr-2 fab fa-twitter
        .text-capitalize Twitter
    v-btn.mt-4.rounded-lg(outlined, large, block, disabled)
      v-layout(align-center)
        v-icon.mr-2 fab fa-instagram
        .text-capitalize Instagram
</template>

<script>
export default {
  data() {
    return {
      step: 1,
    }
  },
}
</script>
