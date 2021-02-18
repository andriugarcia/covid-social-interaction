import CreateActivity from './createActivity.vue'

export default {
  title: 'CreateActivity',
}

const Template = (_, { argTypes }) => ({
  components: { CreateActivity },
  props: Object.keys(argTypes),
  template: '<CreateActivity />',
})

export const Primary = Template.bind({})
