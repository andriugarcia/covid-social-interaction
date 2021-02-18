import Chat from './chat.vue'

export default {
  title: 'Chat',
}

const Template = (_, { argTypes }) => ({
  components: { Chat },
  props: Object.keys(argTypes),
  template: '<Chat />',
})

export const Primary = Template.bind({})
