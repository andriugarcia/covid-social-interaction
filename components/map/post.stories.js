import Post from './post.vue'

export default {
  title: 'Post',
}

const Template = (_, { argTypes }) => ({
  components: { Post },
  props: Object.keys(argTypes),
  template: '<Post :type="type" />',
})

export const Primary = Template.bind({})
Primary.args = { type: 'image' }
Primary.argTypes = {
  type: {
    control: {
      type: 'select',
      options: ['image', 'short', 'video', 'direct'],
    },
  },
}
