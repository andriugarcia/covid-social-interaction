import Search from './search.vue'

export default {
  title: 'Search',
}

const Template = (_, { argTypes }) => ({
  components: { Search },
  props: Object.keys(argTypes),
  template: '<Search :centre="centre"/>',
})

export const Primary = Template.bind({})

Primary.args = {
  centre: [-3.612036640743373, 37.17319576390279],
}
