import Home from './home.vue'

export default {
  title: 'Home',
}

const Template = (_, { argTypes }) => ({
  components: { Home },
  props: Object.keys(argTypes),
  template: '<Home />',
})

export const Primary = Template.bind({})
