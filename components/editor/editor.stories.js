import Editor from './editor.vue'

export default {
  title: 'Editor',
}

const Template = (_, { argTypes }) => ({
  components: { Editor },
  props: Object.keys(argTypes),
  template: '<Editor />',
})

export const Primary = Template.bind({})
