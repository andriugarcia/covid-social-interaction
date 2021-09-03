import axios from '../axios'

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
      this.app.$fire.analytics.logEvent('new_post', {
        post_id: post.post_id,
        profile_id: post.profile_id,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async openPost(_, postId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/post/open/${postId}`)
      this.app.$fire.analytics.logEvent('open_post', {
        post_id: postId
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async getNearbyPosts(_, { coordinates, page }) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/posts/nearby?lat=${coordinates.lat}&lng=${coordinates.lng}&page=${page}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },

  async getSavedPosts(_, page) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/posts/saved/${page}`)
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
      this.app.$fire.analytics.logEvent('share', {
        content_type: 'post',
        item_id: post.post,
        method: 'Olimaps'
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async like(_, postId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/posts/like/${postId}`)
      // this.app.$fire.analytics.logEvent('eventCategory', 'eventAction', 'eventLabel', 'eventValue')
      this.app.$fire.analytics.logEvent('post_like', {
        post_id: postId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },

  async dislike(_, postId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/posts/dislike/${postId}`)
      this.app.$fire.analytics.logEvent('post_dislike', {
        post_id: postId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async save(_, postId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/posts/save/${postId}`)
      this.app.$fire.analytics.logEvent('post_save', {
        post_id: postId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async unsave(_, postId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/posts/unsave/${postId}`)
      this.app.$fire.analytics.logEvent('post_unsave', {
        post_id: postId,
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
