import Profile from './profile.vue'

export default {
  title: 'Profile',
}

const Template = (_, { argTypes }) => ({
  components: { Profile },
  props: Object.keys(argTypes),
  template: '<Profile />',
})

export const Primary = Template.bind({})
