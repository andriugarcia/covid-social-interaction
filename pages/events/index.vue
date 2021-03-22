<template lang="pug">
  #events
    v-toolbar(color="primary", dark, style="position: fixed; top: 0; width: 100%; z-index: 20")
      v-btn(icon)
        v-icon fas fa-arrow-left
      v-toolbar-title Eventos
      v-spacer
      v-btn(color="white", rounded, depressed, dark, small)
        .primary--text.text-capitalize Nuevo Evento
    .pa-4
      v-card.mb-2.rounded-xl(v-for="i in 10", outlined)
        v-img(src="https://picsum.photos/200", height="160")
        v-chip.ml-4.mt-n6(color="deep-purple", dark)
          v-icon.mr-1(small) fas fa-glass-cheers
          span Fiesta
        v-layout.px-4.mt-2(justify-space-between, align-center)
          .font-weight-light Mie 13 17:30
          avatar-group(:avatars="['https://picsum.photos/200', 'https://picsum.photos/201', 'https://picsum.photos/202', 'https://picsum.photos/203', 'https://picsum.photos/204', 'https://picsum.photos/205', 'https://picsum.photos/206']", :limit="5")
        v-card-title Nombre del Evento
        v-layout
          em.pb-2.ml-4 a 200m

</template>

<script>
import AvatarGroup from '@/components/avatar-group'
export default {
  components: {
    AvatarGroup,
  },
}
</script>
