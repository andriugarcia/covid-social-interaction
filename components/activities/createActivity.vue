<template lang="pug">
  #createActivity
    v-layout
      v-btn(icon)
        v-icon fas fa-arrow-left
      v-subheader NUEVA ACTIVIDAD
    v-text-field(label="Titulo")
    v-combobox(v-model="model", :filter="filter", :hide-no-data="!search", :items="items", :search-input.sync="search", hide-selected, label="Categoría", small-chips)
      template(v-slot:selection="{ attrs, item, parent, selected }")
        v-chip(v-if="item === Object(item)", dark, pill, v-bind="attrs", :color="`${item.color}`", :input-value="selected", small)
          v-icon(small) fas fa-glass-cheers
          span.ml-1.font-weight-bold {{ item.text }}
      template(v-slot:item="{ index, item }")
        v-chip.font-weight-bold(:color="`${item.color}`", pill, dark, small)
          v-icon(small) fas fa-glass-cheers
          span.ml-1.font-weight-bold {{ item.text }}
    v-textarea(auto-grow, :rows="1", label="Descripción")
    v-file-input(accept="image/png, image/jpeg, image/bmp", placeholder="Imagen de Portada", prepend-icon="", append-icon="fas fa-image")
    v-dialog(v-model="locationSelectorOpened", fullscreen, hide-overlay, transition="dialog-bottom-transition")
      template(v-slot:activator="{on, attrs}")
        v-text-field(label="Ubicación", :value="location != null ? location.lng.toFixed(4) + '. ' + location.lng.toFixed(4) : ''", v-on="on", readonly, append-icon="fas fa-map-marker-alt")
      v-card
        location-select(:initialPosition="{lng: -3.612036640743373, lat: 37.17319576390279}", @updated="updateLocation", @back="locationSelectorOpened = false")
    v-menu(ref="menu", v-model="menuDay", :close-on-content-click="false", :return-value.sync="date", transition="scale-transition", offset-y, min-width="auto")
      template(v-slot:activator="{on, attrs}")
        v-text-field(v-model="date", label="Fecha", v-on="on", v-bind="attrs", append-icon="far fa-calendar")
      v-date-picker(v-model="date", no-title, :min="min")
    v-menu(ref="menu", v-model="menuTime", :close-on-content-click="false", :nudge-right="40", :return-value.sync="time", transition="scale-transition", offset-y, max-width="290px", min-width="290px")
      template(v-slot:activator="{on, attrs}")
        v-text-field(v-model="time", label="Hora", append-icon="far fa-clock", readonly, v-bind="attrs", v-on="on")
      v-time-picker(v-model="time", full-width, format="24hr", @click:minute="$refs.menu.save(time)")
    .title Añadir Grupo
    p Al añadir un grupo los asistentes al evento podrán hablar entre ellos y conocerse
    v-list
      v-list-item(@click="")
        v-list-item-avatar
          v-icon fas fa-plus-circle
        v-list-item-content
          v-list-item-title Crear grupo nuevo
      v-list-item(v-for="i in 5", :key="i", @click="")
        v-list-item-avatar
          v-img(src="https://picsum.photos/200")
        v-list-item-content
          v-list-item-title Group name
        v-list-item-action
          avatar-group(:avatars="['https://picsum.photos/200', 'https://picsum.photos/201', 'https://picsum.photos/202', 'https://picsum.photos/203', 'https://picsum.photos/204', 'https://picsum.photos/205', 'https://picsum.photos/206']", :limit="6")
    v-layout.mt-6(justify-center)
      v-btn(rounded, color="primary") 
        v-icon.mr-2(small) fas fa-dice
        .text-capitalize Crear Actividad

</template>

<script>
import AvatarGroup from '../avatar-group'
export default {
  components: {
    locationSelect: () => import('../map/locationSelect'),
    AvatarGroup,
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    time: null,
    min: new Date().toISOString().substr(0, 10),
    menuDay: false,
    menuTime: false,
    locationSelectorOpened: false,
    location: null,
    items: [
      { header: 'Categoría' },
      {
        text: 'Foo',
        color: 'blue',
      },
      {
        text: 'Bar',
        color: 'red',
      },
    ],
    methods: {
      updateLocation(coordinates) {
        this.location = coordinates
      },
    },
  }),
}
</script>
