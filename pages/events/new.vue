<template lang="pug">
#createActivity(style='position: relative; width: 100%; height: 100%; inset: 0')
  v-toolbar(
    color='primary',
    dark,
    flat,
    style='position: absolute; top: 0; width: 100%; z-index: 20'
  )
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    v-toolbar-title New Event
  v-sheet(
    flat,
    color='white',
    style='height: 100%; overflow-y: scroll; padding-top: 160px; padding-bottom: 80px'
  )
    v-sheet.mt-14(
      color='white',
      style='position: absolute; top: 0; left: 0; right: 0; z-index: 20'
    )
      v-layout.pa-3(justify-center)
        v-flex(xs3)
          v-card.py-2.mx-1.text-center.rounded-xl(
            :color='step == 1 || step == 2 ? "primary" : "white"',
            :dark='step == 1 || step == 2',
            flat,
            style='width: 120px'
          )
            .font-weight-black(style='display: block') 1
            .font-weight-bold PLAN
        v-flex(xs3)
          v-card.py-2.mx-1.text-center.rounded-xl(
            :color='step == 3 ? "primary" : "white"',
            :dark='step == 3',
            flat,
            style='width: 120px'
          )
            .font-weight-black(style='display: block') 2
            .font-weight-bold INVITES
        v-flex(xs3)
          v-card.py-2.mx-1.text-center.rounded-xl(
            :color='step == 4 ? "primary" : "white"',
            :dark='step == 4',
            flat,
            style='width: 120px'
          )
            .font-weight-black(style='display: block') 3
            .font-weight-bold WHERE
        v-flex(xs3)
          v-card.py-2.mx-1.text-center.rounded-xl(
            :color='step == 5 ? "primary" : "white"',
            :dark='step == 5',
            flat,
            style='width: 120px'
          )
            .font-weight-black(style='display: block') 4
            .font-weight-bold WHEN
    .px-4(v-if='step == 1')
      .overline.font-weight-black.mt-2 CITY
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "city"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}
      .overline.font-weight-black.mt-2 CULTURE
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "culture"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}
      .overline.font-weight-black.mt-2 EXTERIOR
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "outdoor"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}
      .overline.font-weight-black.mt-2 FOOD
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "food"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}
      .overline.font-weight-black.mt-2 LEISURE
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "leisure"',
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
      .overline.font-weight-black.mt-2 SPORTS
      v-layout(wrap)
        v-chip.mr-2.mb-2(
          v-if='category.category == "sports"',
          v-for='(category, i) in categories',
          :key='i',
          color='white darken-1',
          @click='selectCategory(category)'
        )
          span {{ category.emoji }} {{ category.name }}

    .px-4(v-if='step == 2')
      .overline.font-weight-black.mt-2 IMAGE (OPTIONAL)
      avatar-input(large, @update='updateCover')
      .overline.font-weight-black.mt-2 TITLE
      v-text-field(label='Title', v-model='event.title')
      .overline.font-weight-black DESCRIPTION
      v-textarea(
        label='Description',
        v-model='event.description',
        maxlength='500',
        counter
      )
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
      .overline.font-weight-black ASSIGN GROUP
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
        ) UPDATE
      v-btn.my-2(
        v-else,
        color='grey lighten-4',
        @click='selectGroupDialog = true',
        depressed,
        block
      ) Add Group
      viewer(v-model='selectGroupDialog')
        group-select(
          @back='selectGroupDialog = false',
          @selected='updateGroup'
        )
      v-alert.mb-6(text, color='primary') Attendees will be able to join the group to stay in touch.
      .overline.font-weight-black INVITE USERS
      v-text-field.rounded-lg(
        dense,
        filled,
        placeholder='Search',
        v-model='textFilter',
        prepend-inner-icon='fas fa-search'
      )
      v-list(
        color='white',
        style='height: calc(100vh - 350px); overflow-y: scroll'
      )
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
      .overline.font-weight-black LOCATION
      v-text-field(
        label='Location',
        @click='openLocationSelect',
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
      .overline.font-weight-black PLACE DESCRIPTION
      v-textarea(
        placeholder='At the park fountain',
        v-model='event.place_description',
        maxlength='500',
        counter
      )
    .px-4(v-else-if='step == 5')
      .overline.font-weight-black START DATE
      v-alert(text, color='primary') What time does the event start?
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
            label='Date',
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
            label='Time',
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
      .overline.font-weight-black END DATE
      v-alert(text, color='primary') At what time does the event finish?
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
            label='Date',
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
            label='Time',
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
      v-alert(v-if='badDayOrder', text, type='error') The end time cannot be before the start time
      v-alert(v-else-if='hasPassed', text, type='error') You cannot create an event that has already passed
      v-alert(v-else-if='tooEarly', text, type='error') You cannot create an event 2 hours before it starts
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
    title: 'New Event | Olimaps',
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
    $route(route) {
      if (typeof route.query.location_select === 'undefined') {
        this.locationSelectorOpened = false
      }
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
    openLocationSelect() {
      this.$router.push({
        query: {
          location_select: 'true',
        },
      })
      this.locationSelectorOpened = true
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
          this.date.replace(/-/g, '/') + ' ' + this.time
        ).toISOString()
        this.event.date.end = new Date(
          this.dateEnd.replace(/-/g, '/') + ' ' + this.timeEnd
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
