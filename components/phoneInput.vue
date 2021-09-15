<template lang="pug">
#phoneInput
  v-layout(align-center)
    v-autocomplete.mr-2(
      v-model='countrySelected',
      hide-details,
      :items='countryPrefixes',
      outlined,
      append-icon='',
      item-text='name',
      item-value='mask',
      dense,
      filled,
      style='max-width: 80px'
    )
      template(v-slot:selection='{ item, index }')
        span {{ item.dial_code }}
      template(v-slot:item='{ item, index }')
        span {{ item.dial_code }} {{ item.name }}
    v-text-field(
      v-model='phone',
      dense,
      filled,
      hide-details,
      rounded,
      type='phone',
      v-mask='countrySelected',
      placeholder='Número de Teléfono',
      append-icon='fas fa-phone'
    )
</template>

<script>
import countryPrefixes from '@/assets/countryPrefixes.json'
export default {
  props: ['value'],
  data() {
    return {
      phone: '',
      countrySelected: '### ### ###',
      maskSelected: null,
      countryPrefixes,
    }
  },
  watch: {
    phone(value) {
      this.$emit(
        'input',
        this.countrySelected.dial_code + value.replaceAll(' ', '')
      )
    },
  },
  methods: {
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1
    },
  },
}
</script>