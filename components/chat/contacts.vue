<template lang="pug">
  #contacts
    v-card(flat, color="text", dark, tile, style="border-radius: 0 0 24px 24px")
      v-layout.pa-2(justify-space-between)
        v-btn(icon, small, @click="$emit('back')")
          v-icon fas fa-arrow-left
        v-btn.text-capitalize(outlined, small, rounded) Nuevo Grupo
      v-text-field.mx-2.mt-4(solo, color="background", dense, placeholder="Buscar", append-icon="fas fa-search")
    v-card(flat, color="yellow")
      v-tabs(fixed-tabs)
        v-tab 
          v-chip.text-capitalize(color="primary") 
            div Chats
            v-chip.ml-2(small) 15
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
      v-list-item(v-for="i in 5", :key="i", @click="")
        v-list-item-avatar
          v-img(src="https://picsum.photos/200")
        v-list-item-content
          v-list-item-title.font-weight-bold Username
        v-list-item-action
          v-chip(color="primary") 15
</template>
