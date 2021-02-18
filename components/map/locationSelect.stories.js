import LocationSelect from './locationSelect.vue'

export default {
  title: 'Map/locationSelect',
}

const Template = (_, { argTypes }) => ({
  components: { LocationSelect },
  props: Object.keys(argTypes),
  template: '<LocationSelect :initialPosition="initialPosition"/>',
})

export const Primary = Template.bind({})
Primary.args = {
  initialPosition: { lng: -3.6120366, lat: 37.173195 },
}
