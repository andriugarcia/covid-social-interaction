import AvatarGroup from './avatar-group.vue'

export default {
  title: 'AvatarGroup',
}

const Template = (_, { argTypes }) => ({
  components: { AvatarGroup },
  props: Object.keys(argTypes),
  template: '<AvatarGroup :avatars="avatars" :limit="limit"/>',
})

export const Primary = Template.bind({})

Primary.args = {
  avatars: ['https://picsum.photos/190'],
  limit: 6,
}
