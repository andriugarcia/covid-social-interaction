import Map from './map.vue'

export default {
  title: 'Home/Map',
}

const Template = (_, { argTypes }) => ({
  components: { Map },
  props: Object.keys(argTypes),
  template:
    '<Map :markers="markers" :mapPosition="mapPosition", :userPosition="userPosition",/>',
})

export const Primary = Template.bind({})
Primary.args = {
  mapPosition: { lng: -3.6120366, lat: 37.173195 },
  userPosition: { lng: -3.6120366, lat: 37.173195 },
  markers: [
    {
      type: 'video',
      lng: 37.197208,
      lat: -3.612036,
    },
    {
      type: 'video',
      lng: 37.173195,
      lat: -3.608211,
    },
    {
      type: 'video',
      lng: 37.174195,
      lat: -3.607211,
    },
    {
      type: 'video',
      lng: 37.172195,
      lat: -3.609211,
    },
    {
      type: 'video',
      lng: 37.176195,
      lat: -3.61211,
    },
    {
      type: 'video',
      lng: 37.182195,
      lat: -3.61211,
    },
    {
      type: 'image',
      lng: 37.192208,
      lat: -3.615036,
    },
    {
      type: 'image',
      lng: 37.179195,
      lat: -3.601211,
    },
    {
      type: 'video',
      lng: 37.172826,
      lat: -3.590358,
    },
    {
      type: 'video',
      lng: 37.1604472,
      lat: -3.592097,
    },
    {
      type: 'short',
      lng: 37.1734472,
      lat: -3.595097,
    },
  ],
}

Primary.argTypes = {
  markers: {
    type: 'array',
  },
  centre: {
    type: 'array',
  },
}
// Primary.argTypes = {
//   type: {
//     control: {
//       type: 'select',
//       options: [
//         'image',
//         'short',
//         'video',
//         'direct',
//       ],
//     }
//   }
// }
