<template lang="pug">
  #editor.pa-4
    v-layout(justify-space-between)
      v-btn(icon, @click="$emit('back')")
        v-icon.text--text fas fa-arrow-left
      v-btn.text-capitalize(outlined, rounded, color="text", @click="permanentOpened = true") 
        span.text--text Hacer permanente
        v-icon.text--text.ml-2 fas fa-bolt
    v-layout.pt-4
      v-avatar.mr-2.mt-2.elevation-5(size="40")
        v-img(src="https://picsum.photos/200")
      v-textarea(placeholder="Escribe tu post", auto-grow, rows="1")
    div(style="position: absolute bottom: 0 left: 0 right: 0")
      v-dialog(v-model="locationSelectorOpened", fullscreen, hide-overlay, transition="dialog-bottom-transition")
        template(v-slot:activator="{on, attrs}")
          v-btn(v-on="on", text)
            v-icon.text--text fas fa-globe-europe
            .ml-2.text--text.font-weight-bold.text-capitalize(style="letter-spacing: 0") {{ location == null ? 'Tu ubicación actual' : `${location.lng.toFixed(6)}, ${location.lat.toFixed(6)}`}}
        v-card
          location-select(:initialPosition="{lng: -3.612036640743373, lat: 37.17319576390279}", @updated="updateLocation", @back="locationSelectorOpened = false")
      v-divider.my-2
      v-layout.pa-4(justify-space-between)
        v-layout
          v-btn.mx-1(icon)
            v-icon.text--text fas fa-image
          v-btn.mx-1(icon)
            v-icon.text--text fas fa-microphone
          v-btn.mx-1(icon)
            v-icon.text--text fas fa-link
        v-btn(rounded, flat, color="primary", dark) 
          .mr-2.text-capitalize Publicar
          v-icon(small) far fa-edit
    v-bottom-sheet(v-model="permanentOpened")
      v-card.pa-4.rounded-lg
        v-subheader POST PERMANENTE
        p El post no desaparecerá del mapa siendo visible mientras permanezca activo
        v-text-field(type="number", suffix="€/mes", autofocus, v-model="bidValue")
        span Audiencia mensual estimada: <b>1000 visualizaciones</b>
        v-btn.mt-2(block, color="yellow darken-2", rounded) ACTIVAR
    
</template>

<script>
export default {
  data: () => ({
    locationSelectorOpened: false,
    permanentOpened: false,
    bidValue: 1,
    location: null,
  }),

  methods: {
    updateLocation(coordinates) {
      this.location = coordinates
    },
  },
}
</script>
