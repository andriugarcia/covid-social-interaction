<template lang="pug">
#activity
  v-toolbar(color="primary", dark)
    v-btn(icon, @click="$router.replace({ hash: '' })")
      v-icon fas fa-arrow-left
    span.font-weight-black Actividad
  v-layout.px-6(v-for="i in 10", align-center)
    v-icon.mr-4(color="primary") fas fa-comment-dots
    v-avatar(size="40")
      v-img(src="https://picsum.photos/200") 
    .ml-2.mt-2.text--text.font-weight-bold
      span @username
      p Ha contestado a tu post
  //- 6 Barquero
  //- 5 Marido
  //- 4 Amante
  //- 3 Amigo
  //- 2 Loco
  //- 1 Mujer
</template>
