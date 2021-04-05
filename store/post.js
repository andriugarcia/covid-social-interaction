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
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/posts?xmin=${bbox._sw.lng}&ymin=${bbox._sw.lat}&xmax=${bbox._ne.lng}&ymax=${bbox._ne.lat}`
      )
      commit('setPosts', data)
    } catch (err) {
      console.error(err)
      return []
    }
  },

  async getPost({ _ }, src) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/post/${src}`)
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },

  async getPostsByPoint(_, coordinates) {
    const { data } = await axios.get(
      `${process.env.SERVER_URL}/posts/point?lat=${coordinates.lat}&lng=${coordinates.lng}`
    )
    return data
  },

  async createPost({ commit }, post) {
    try {
      await axios.post(`${process.env.SERVER_URL}/posts`, post)
      commit('setPostCreated', true, { root: true })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async openPost(_, postId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/post/open/${postId}`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async getNearbyPosts(_, coordinates) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/posts/nearby?lat=${coordinates.lat}&lng=${coordinates.lng}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },

  async share({ commit }, post) {
    try {
      await axios.post(`${process.env.SERVER_URL}/posts/share/${post.post}`, {
        targets: post.targets,
        message: post.message,
      })
      commit('setShareCreated', true, { root: true })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
