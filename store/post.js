import axios from 'axios'

export const state = () => ({
  posts: [],
})

export const mutations = {
  setPosts(state, posts) {
    state.posts = posts
  },
}

export const actions = {
  async getPosts({ commit }, bbox) {
    const { data } = await axios.get(
      `${process.env.SOCKET_URL}/posts?nwlat=${bbox._ne.lat}&nwlng=${bbox._sw.lng}&selat=${bbox._sw.lat}&selng=${bbox._ne.lng}`
    )
    commit('setPosts', data)
  },

  async getPostsByPoint(_, coordinates) {
    const { data } = await axios.get(
      `${process.env.SOCKET_URL}/posts/point?lat=${coordinates.lat}&lng=${coordinates.lng}`
    )
    return data
  },
}
