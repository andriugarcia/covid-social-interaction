<template lang="pug">
#createActivity(style='position: relative; inset: 0')
  v-toolbar(
    color='primary',
    dark,
    flat,
    style='position: absolute; top: 0; width: 100%; z-index: 20'
  )
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    v-toolbar-title Nuevo Evento
  v-sheet(
    flat,
    color='white',
    style='height: 100%; overflow-y: scroll; position: relative; padding-top: 160px'
  )
    v-layout.pa-6.mt-12(
      justify-space-around,
      style='position: absolute; top: 0; left: 0; right: 0'
    )
      v-flex(xs3)
        v-card.py-2.mx-1.text-center.rounded-xl(
          :color='step == 1 || step == 2 ? "primary" : "white"',
          :dark='step == 1 || step == 2',
          flat,
          style='width: 120px'
        )
          .font-weight-black(style='display: block') 1
          .font-weight-bold QUE
      v-flex(xs3)
        v-card.py-2.mx-1.text-center.rounded-xl(
          :color='step == 3 ? "primary" : "white"',
          :dark='step == 3',
          flat,
          style='width: 120px'
        )
          .font-weight-black(style='display: block') 2
          .font-weight-bold QUIEN
      v-flex(xs3)
        v-card.py-2.mx-1.text-center.rounded-xl(
          :color='step == 4 ? "primary" : "white"',
          :dark='step == 4',
          flat,
          style='width: 120px'
        )
          .font-weight-black(style='display: block') 3
          .font-weight-bold DONDE
      v-flex(xs3)
        v-card.py-2.mx-1.text-center.rounded-xl(
          :color='step == 5 ? "primary" : "white"',
          :dark='step == 5',
          flat,
          style='width: 120px'
        )
          .font-weight-black(style='display: block') 4
          .font-weight-bold CUANDO
    .px-4(v-if='step == 1')
      .overline.font-weight-black.mt-2 CIUDAD
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "city"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}
      .overline.font-weight-black.mt-2 CULTURA
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "culture"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}
      .overline.font-weight-black.mt-2 SOCIAL
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "social"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}

    .px-4(v-if='step == 2')
      .overline.font-weight-black.mt-2 IMAGEN (OPCIONAL)
      avatar-input(large, @update='updateCover')
      .overline.font-weight-black.mt-2 TITULO
      v-text-field(label='Titulo', v-model='event.title')
      .overline.font-weight-black DESCRIPCION
      v-textarea(label='Descripción', v-model='event.description')
      //- v-combobox(v-model="event.category", :items="items", item-text="name", item-value="key", hide-selected, placeholder="Categoría", small-chips)
        template(v-slot:selection="{ attrs, item, parent, selected }")
          v-chip(v-if="item === Object(item)", dark, pill, v-bind="attrs", :color="`${item.color}`", :input-value="selected", small)
            v-icon(small) {{ item.icon }}
            span.ml-1.font-weight-bold {{ item.name }}
        template(v-slot:item="{ index, item }")
          v-chip.font-weight-bold(:color="`${item.color}`", pill, dark, small)
            v-icon(small) {{ item.icon }}
            span.ml-1.font-weight-bold {{ item.name }}
    .px-4(v-if='step == 3')
      .overline.font-weight-black ASIGNAR GRUPO
      v-layout.my-2(v-if='group', align-center)
        v-avatar(color='primary')
          v-img(:src='group.chat.cover')
        span.ml-2 {{ group.chat.title }}
        v-spacer
        v-btn(
          small,
          depressed,
          color='white darken-1',
          @click='selectGroupDialog = true'
        ) CAMBIAR
      v-btn.my-2(
        v-else,
        color='grey lighten-4',
        @click='selectGroupDialog = true',
        depressed,
        block
      ) Añadir Grupo
      v-dialog(
        v-model='selectGroupDialog',
        fullscreen,
        hide-overlay,
        transition='dialog-bottom-transition'
      )
        group-select(
          @back='selectGroupDialog = false',
          @selected='updateGroup'
        )
      v-alert.mb-12(text, color='primary') Asignar un grupo al evento permitirá que los asistentes al evento puedan acceder al grupo y conocer al resto de asistentes.
      .overline.font-weight-black INVITAR USUARIOS
      v-text-field.rounded-lg(
        dense,
        filled,
        placeholder='Buscar',
        v-model='textFilter',
        prepend-inner-icon='fas fa-search'
      )
      v-list(color='white')
        v-list-item(
          v-for='(person, i) in peopleFiltered',
          :key='person.profile_id',
          @click='selectMember(person)'
        )
          v-list-item-avatar(color='white')
            v-img(:src='person.profile_picture')
          v-list-item-title {{ person.username }}
          v-list-item-action
            v-checkbox(
              :value='person.selected',
              small,
              color='primary',
              outlined
            )
      //- v-textarea(auto-grow, :rows="1", label="Descripción")
      //- v-file-input(accept="image/png, image/jpeg, image/bmp", placeholder="Imagen de Portada", prepend-icon="", append-icon="fas fa-image")
    .px-4(v-else-if='step == 4')
      .overline.font-weight-black UBICACIÓN
      v-text-field(
        label='Ubicación',
        @click='locationSelectorOpened = true',
        :value='event.coordinates != null ? event.coordinates.lat.toFixed(4) + ". " + event.coordinates.lng.toFixed(4) : ""',
        v-on='on',
        readonly,
        append-icon='fas fa-map-marker-alt'
      )
      v-dialog(
        v-model='locationSelectorOpened',
        fullscreen,
        hide-overlay,
        transition='dialog-bottom-transition'
      )
        v-card
          location-select(
            :initialPosition='{ lng: -3.612036640743373, lat: 37.17319576390279 }',
            @updated='updateLocation',
            @back='locationSelectorOpened = false'
          )
      .overline.font-weight-black DESCRIPCION DEL SITIO (OPCIONAL)
      v-textarea(
        placeholder='En la fuente del parque',
        v-model='event.place_description'
      )
    .px-4(v-else-if='step == 5')
      .overline.font-weight-black FECHA DE INICIO
      v-alert(text, color='primary') A qué hora empieza el evento
      v-menu(
        ref='menuDate',
        v-model='menuDay',
        :close-on-content-click='false',
        :return-value.sync='date',
        transition='scale-transition',
        offset-y,
        min-width='auto'
      )
        template(v-slot:activator='{ on, attrs }')
          v-text-field(
            :value='date',
            label='Fecha',
            v-on='on',
            v-bind='attrs',
            append-icon='far fa-calendar'
          )
        v-date-picker(
          v-model='date',
          no-title,
          :min='min',
          @change='updateDate'
        )
      v-menu(
        ref='menuTime',
        v-model='menuTime',
        :close-on-content-click='false',
        :nudge-right='40',
        :return-value.sync='time',
        transition='scale-transition',
        offset-y,
        max-width='290px',
        min-width='290px'
      )
        template(v-slot:activator='{ on, attrs }')
          v-text-field(
            v-model='time',
            label='Hora',
            append-icon='far fa-clock',
            readonly,
            v-bind='attrs',
            v-on='on'
          )
        v-time-picker(
          v-model='time',
          full-width,
          format='24hr',
          @click:minute='$refs.menuTime.save(time)',
          :allowed-minutes='allowedStep'
        )
      .overline.font-weight-black FECHA DE FINALIZACIÓN
      v-alert(text, color='primary') A qué hora acaba el evento
      v-menu(
        ref='menuDateEnd',
        v-model='menuDayEnd',
        :close-on-content-click='false',
        :return-value.sync='date',
        transition='scale-transition',
        offset-y,
        min-width='auto'
      )
        template(v-slot:activator='{ on, attrs }')
          v-text-field(
            :value='dateEnd',
            label='Fecha',
            v-on='on',
            v-bind='attrs',
            append-icon='far fa-calendar'
          )
        v-date-picker(
          v-model='dateEnd',
          no-title,
          :min='minEnd',
          @change='$refs.menuDateEnd.save(date)'
        )
      v-menu(
        ref='menuTimeEnd',
        v-model='menuTimeEnd',
        :close-on-content-click='false',
        :nudge-right='40',
        :return-value.sync='time',
        transition='scale-transition',
        offset-y,
        max-width='290px',
        min-width='290px'
      )
        template(v-slot:activator='{ on, attrs }')
          v-text-field(
            v-model='timeEnd',
            label='Hora',
            append-icon='far fa-clock',
            readonly,
            v-bind='attrs',
            v-on='on'
          )
        v-time-picker(
          v-model='timeEnd',
          full-width,
          format='24hr',
          @click:minute='$refs.menuTimeEnd.save(time)',
          :allowed-minutes='allowedStep'
        )
      v-alert(v-if='badDayOrder', text, type='error') La hora de finalización no puede ocurrir antes que la de inicio
      v-alert(v-else-if='hasPassed', text, type='error') No se puede crear un evento en el pasado
      v-alert(v-else-if='tooEarly', text, type='error') No se puede crear un evento 2 horas antes de que comience
    v-btn(
      v-if='step > 1',
      fab,
      absolute,
      left,
      style='bottom: 32px',
      @click='step--'
    )
      v-icon fas fa-arrow-left
    v-btn(
      v-if='step > 1',
      color='primary',
      fab,
      absolute,
      right,
      style='bottom: 32px',
      @click='nextStep',
      :disabled='disabled'
    )
      v-icon {{ step == 5 ? "fas fa-check" : "fas fa-arrow-right" }}
    //- v-layout.mt-6(justify-center)
      v-btn(rounded, color="primary") 
        v-icon.mr-2(small) fas fa-dice
        .text-capitalize Crear Actividad
</template>

<script>
import AvatarGroup from '@/components/avatar-group'
import AvatarInput from '@/components/avatar-input'
export default {
  head: {
    title: 'Nuevo Evento | Olimaps',
  },
  components: {
    locationSelect: () => import('@/components/map/locationSelect'),
    groupSelect: () => import('@/components/editor/groupSelect'),
    AvatarGroup,
    AvatarInput,
  },
  data() {
    return {
      step: 1,
      allowedStep: (m) => m % 5 === 0,
      date: new Date().toISOString().substr(0, 10),
      time: null,
      dateEnd: new Date().toISOString().substr(0, 10),
      timeEnd: null,
      min: new Date().toISOString().substr(0, 10),
      minEnd: new Date().toISOString().substr(0, 10),
      badDayOrder: false,
      tooEarly: false,
      hasPassed: false,
      menuDay: false,
      menuTime: false,
      menuDayEnd: false,
      menuTimeEnd: false,
      locationSelectorOpened: false,
      selectGroupDialog: false,
      categories: this.$store.state.event.categories,
      people: [],
      textFilter: '',
      event: {
        title: '',
        description: '',
        place_description: '',
        emoji: '',
        coordinates: null,
        group_id: null,
        cover: null,
        members: [],
        date: {
          start: null,
          end: null,
        },
      },
      group: null,
    }
  },
  async fetch() {
    this.people = (await this.$store.dispatch('user/getPeople')).map(
      (person) => ({
        ...person,
        selected: false,
      })
    )
  },
  computed: {
    peopleFiltered() {
      if (this.textFilter.length === 0) {
        return [...this.people]
      }
      const pf = this.people.filter((member) => {
        const name = member.username

        return name.toLowerCase().includes(this.textFilter.toLowerCase())
      })

      return pf
    },
    disabled() {
      switch (this.step) {
        case 1:
          return false
        case 2:
          return (
            this.event.title.length === 0 || this.event.description.length === 0
          )
        case 3:
          return false
        case 4:
          return !this.event.coordinates
        case 5:
          return this.badDayOrder || !this.time || !this.timeEnd
      }
      return true
    },
  },
  watch: {
    date() {
      this.checkTimeOrder()
    },
    dateEnd() {
      this.checkTimeOrder()
    },
    time() {
      this.checkTimeOrder()
    },
    timeEnd() {
      this.checkTimeOrder()
    },
  },
  methods: {
    selectMember(member_id) {
      const index = this.event.members.findIndex(
        (member) => member == member_id
      )

      if (index == -1) {
        this.event.members.push(member_id)
      } else {
        this.event.members.unshift(index, 1)
      }
    },
    updateLocation(coordinates) {
      this.event.coordinates = coordinates
    },
    updateCover(img) {
      this.event.cover = img
    },
    updateDate(date) {
      this.$refs.menuDate.save(date)
      this.dateEnd = new Date(date).toISOString().substr(0, 10)
      this.minEnd = new Date(date).toISOString().substr(0, 10)
    },
    updateGroup(group) {
      this.group = group
    },
    checkTimeOrder() {
      if (this.time && this.timeEnd) {
        this.badDayOrder =
          new Date(this.date.replace(/-/g, '/') + ' ' + this.time) >
          new Date(this.dateEnd.replace(/-/g, '/') + ' ' + this.timeEnd)
      } else if (this.time) {
        const now = new Date()
        this.tooEarly =
          new Date(this.date.replace(/-/g, '/') + ' ' + this.time) <=
          new Date(now.getTime() + 7200000)
        this.hasPassed =
          new Date(this.date.replace(/-/g, '/') + ' ' + this.time) <=
          new Date(now.getTime())
      } else {
        this.badDayOrder = false
      }
    },
    selectCategory(category) {
      this.event.emoji = category.emoji
      this.step++
    },
    async nextStep() {
      if (this.step !== 5) {
        this.step += 1
      } else {
        this.event.date.start = new Date(
          this.date + ' ' + this.time
        ).toISOString()
        this.event.date.end = new Date(
          this.dateEnd + ' ' + this.timeEnd
        ).toISOString()
        this.event.chat_id = this.group ? this.group.chat_id : null
        const eventId = await this.$store.dispatch(
          'event/createEvent',
          this.event
        )
        this.$router.push({ path: `/events/${eventId}` })
      }
    },
  },
}
</script>
