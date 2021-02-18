import Contacts from './contacts.vue'

export default {
  title: 'Chat/contacts',
}

const Template = (_, { argTypes }) => ({
  components: { Contacts },
  props: Object.keys(argTypes),
  template: '<Contacts />',
})

export const Primary = Template.bind({})
