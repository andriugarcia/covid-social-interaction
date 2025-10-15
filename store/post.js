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
    // Return demo posts for the map
    const demoPosts = [
      {
        post_id: 'demo-post-1',
        coordinates: { lat: 40.4168, lng: -3.7038 },
        text: 'Hermosa vista desde el Retiro',
        type: 'image',
        src: 'https://picsum.photos/400/600?random=100',
        profile_picture: 'https://picsum.photos/50/50?random=101',
        username: 'madrid_explorer',
        likes: 24,
        created_at: Date.now() - 7200000
      },
      {
        post_id: 'demo-post-2',
        coordinates: { lat: 40.4200, lng: -3.7100 },
        text: 'Día perfecto en la plaza',
        type: 'short',
        src: '',
        profile_picture: 'https://picsum.photos/50/50?random=102',
        username: 'city_lover',
        likes: 12,
        created_at: Date.now() - 3600000
      },
      {
        post_id: 'demo-post-3',
        coordinates: { lat: 40.4150, lng: -3.7050 },
        text: 'Concierto increíble',
        type: 'video',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        profile_picture: 'https://picsum.photos/50/50?random=103',
        username: 'music_fan',
        likes: 45,
        created_at: Date.now() - 10800000
      }
    ]
    
    commit('setPosts', demoPosts)
  },

  async getPost({ _ }, src) {
    // Return demo post data
    return {
      post_id: 'demo-single-post',
      text: 'Post demo individual',
      type: 'image',
      src: src || 'https://picsum.photos/400/600?random=110',
      profile_picture: 'https://picsum.photos/50/50?random=111',
      username: 'demo_user',
      likes: 15,
      created_at: Date.now() - 3600000
    }
  },

  async getPostsByPoint(_, coordinates) {
    // Return demo posts for specific point
    return [
      {
        post_id: 'point-post-1',
        coordinates,
        text: 'Post en esta ubicación',
        type: 'image',
        src: 'https://picsum.photos/400/600?random=120',
        profile_picture: 'https://picsum.photos/50/50?random=121',
        username: 'local_user',
        likes: 8,
        created_at: Date.now() - 1800000
      }
    ]
  },

  async createPost({ commit }, post) {
    // Demo mode - simulate post creation
    commit('setPostCreated', true, { root: true })
    return true
  },

  async openPost(_, postId) {
    // Demo mode - always succeed
    return true
  },

  async getNearbyPosts(_, { coordinates, page }) {
    // Return demo nearby posts
    const demoNearbyPosts = [
      {
        post_id: 'nearby-1',
        text: 'Post cercano 1',
        type: 'image',
        src: 'https://picsum.photos/400/600?random=130',
        profile_picture: 'https://picsum.photos/50/50?random=131',
        username: 'nearby_user1',
        likes: 18,
        distance: '0.2 km',
        created_at: Date.now() - 3600000
      },
      {
        post_id: 'nearby-2',
        text: 'Post cercano 2',
        type: 'short',
        src: '',
        profile_picture: 'https://picsum.photos/50/50?random=132',
        username: 'nearby_user2',
        likes: 7,
        distance: '0.5 km',
        created_at: Date.now() - 7200000
      }
    ]
    
    return demoNearbyPosts
  },

  async getSavedPosts(_, page) {
    // Return demo saved posts
    const demoSavedPosts = [
      {
        post_id: 'saved-1',
        text: 'Post guardado 1',
        type: 'image',
        src: 'https://picsum.photos/400/600?random=140',
        profile_picture: 'https://picsum.photos/50/50?random=141',
        username: 'saved_user1',
        likes: 32,
        is_saved: true,
        created_at: Date.now() - 86400000
      },
      {
        post_id: 'saved-2',
        text: 'Post guardado 2',
        type: 'video',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        profile_picture: 'https://picsum.photos/50/50?random=142',
        username: 'saved_user2',
        likes: 28,
        is_saved: true,
        created_at: Date.now() - 172800000
      }
    ]
    
    return demoSavedPosts
  },

  async share({ commit }, post) {
    // Demo mode - simulate sharing
    commit('setShareCreated', true, { root: true })
    return true
  },

  async like(_, postId) {
    // Demo mode - always succeed
    return true
  },

  async dislike(_, postId) {
    // Demo mode - always succeed
    return true
  },
  
  async save(_, postId) {
    // Demo mode - always succeed
    return true
  },
  
  async unsave(_, postId) {
    // Demo mode - always succeed
    return true
  },
}
