<template lang="pug">
  v-layout(style="overflow-x: scroll")
    v-card.rounded-xl.pa-1.mr-2(color="deep-purple", dark, style="font-size: .7em")
      v-layout(align-center, style="height: 100%")
        v-avatar.mr-2.rounded-xl(tile)
          v-img(src="https://picsum.photos/200")
        div.pr-1
          .font-weight-bold(style="white-space: nowrap") MAR 15 17:30
          span(style="white-space: nowrap") 32 personas
    v-avatar.mr-2.rounded-xl(v-for="i in 14", tile, size="62", style="border: 3px solid #F0134D;")
      v-img(src="https://picsum.photos/200")
</template>
