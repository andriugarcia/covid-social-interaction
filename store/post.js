import axios from '../axios'

export const state = () => ({
  posts: [],
})

export const mutations = {
  setPosts(state, posts) {
    // Ensure complete replacement of the array to trigger Vue reactivity
    state.posts = [...posts]
  },
}

export const actions = {
  async getPosts({ commit }, bbox) {
    // Generate demo posts based on current bounding box
    if (!bbox) return
    
    const bounds = bbox.getNorthEast ? {
      north: bbox.getNorth(),
      south: bbox.getSouth(),
      east: bbox.getEast(),
      west: bbox.getWest()
    } : bbox
    
    // Generate posts within the current viewing area
    const generateRandomCoordinate = (min, max) => {
      return min + Math.random() * (max - min)
    }
    
    const postTypes = ['image', 'short', 'video', 'audio']
    const demoTexts = [
      'Beautiful view from here',
      'Perfect day in this area',
      'Great moment at this place',
      'Incredible experience',
      'Fantastic place',
      'Spectacular view',
      'Unique moment',
      'Amazing discovery',
      'Perfect atmosphere',
      'Magical place'
    ]
    const demoUsernames = [
      'explorer_local', 'city_wanderer', 'nature_lover', 'urban_photographer',
      'adventure_seeker', 'moment_capture', 'travel_soul', 'local_guide',
      'discovery_hunter', 'place_collector'
    ]
    
    // Generate 5-8 random posts within the bounding box
    const numberOfPosts = Math.floor(Math.random() * 4) + 5
    const demoPosts = []
    const timestamp = Date.now()
    
    for (let i = 0; i < numberOfPosts; i++) {
      const randomLat = generateRandomCoordinate(bounds.south, bounds.north)
      const randomLng = generateRandomCoordinate(bounds.west, bounds.east)
      const randomType = postTypes[Math.floor(Math.random() * postTypes.length)]
      const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)]
      const randomUsername = demoUsernames[Math.floor(Math.random() * demoUsernames.length)]
      const randomImageId = Math.floor(Math.random() * 1000) + 100
      const randomProfileId = Math.floor(Math.random() * 1000) + 100
      const randomLikes = Math.floor(Math.random() * 50) + 1
      const randomTime = Date.now() - Math.random() * 86400000 // Random time in last 24 hours
      
      let src = ''
      if (randomType === 'image') {
        src = `https://picsum.photos/400/600?random=${randomImageId}`
      } else if (randomType === 'video') {
        const videos = [
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        ]
        src = videos[Math.floor(Math.random() * videos.length)]
      }
      
      demoPosts.push({
        post_id: `bbox-post-${timestamp}-${i}`,
        coordinates: { lat: randomLat, lng: randomLng },
        text: randomText,
        type: randomType,
        src,
        profile_picture: `https://picsum.photos/50/50?random=${randomProfileId}`,
        username: randomUsername,
        likes: randomLikes,
        created_at: randomTime
      })
    }
    
    commit('setPosts', demoPosts)
  },

  async getPost({ _ }, src) {
    // Return demo post data
    return {
      post_id: 'demo-single-post',
      text: 'Individual demo post',
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
        text: 'Post at this location',
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
        text: 'Nearby post 1',
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
        text: 'Nearby post 2',
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
        text: 'Saved post 1',
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
        text: 'Saved post 2',
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
