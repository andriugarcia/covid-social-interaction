import Postbar from './postbar.vue'

export default {
  title: 'Postbar',
}

const Template = (_, { argTypes }) => ({
  components: { Postbar },
  props: Object.keys(argTypes),
  template: '<Postbar />',
})

export const Primary = Template.bind({})
