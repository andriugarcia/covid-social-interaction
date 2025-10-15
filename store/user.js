import axios from '../axios'

export const state = () => ({
  rrssContacts: []
})

export const mutations = {
  setRrssContacts(state, data) {
    state.rrssContacts = data
  }
}

export const actions = {
  async getUser(_, { username, page }) {
    // Return demo user data
    const demoUser = {
      profile_id: 'demo-profile-' + username,
      username: username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      profile_picture: 'https://picsum.photos/200/200?random=' + (username.length * 10),
      description: 'Demo user of Olimaps. I love exploring the city and meeting new people.',
      followers: Math.floor(Math.random() * 200) + 50,
      following: Math.floor(Math.random() * 150) + 20,
      isFollowing: Math.random() > 0.5,
      rrss: [
        { type: 'instagram', name: username + '_ig' },
        { type: 'twitter', name: username + '_tw' }
      ],
      groups: [
        {
          chat: {
            chat_id: 'group-demo-' + username,
            title: 'Group of ' + username,
            cover: 'https://picsum.photos/100/100?random=' + (username.length * 5)
          }
        }
      ],
      post: [
        {
          post_id: 'user-post-1-' + username,
          text: 'My first demo post',
          type: 'image',
          src: 'https://picsum.photos/400/600?random=' + (username.length * 15),
          likes: Math.floor(Math.random() * 50) + 5,
          created_at: Date.now() - 86400000
        },
        {
          post_id: 'user-post-2-' + username,
          text: 'Another interesting post',
          type: 'short',
          src: '',
          likes: Math.floor(Math.random() * 30) + 2,
          created_at: Date.now() - 172800000
        }
      ],
      event: [
        {
          event_id: 'user-event-1-' + username,
          title: 'Event organized by ' + username,
          category: '🎉',
          start_date: Date.now() + 86400000,
          participants: Math.floor(Math.random() * 20) + 3
        }
      ]
    }
    
    return demoUser
  },
  async getNotifications(_, page) {
    // Return demo notifications
    const demoNotifications = [
      {
        id: 'notif-1',
        type: 'like',
        title: 'New like',
        text: 'Someone liked your post',
        image: 'https://picsum.photos/50/50?random=300',
        read: false,
        created_at: Date.now() - 3600000
      },
      {
        id: 'notif-2',
        type: 'follow',
        title: 'New follower',
        text: 'You have a new follower',
        image: 'https://picsum.photos/50/50?random=301',
        read: true,
        created_at: Date.now() - 7200000
      },
      {
        id: 'notif-3',
        type: 'event',
        title: 'New event',
        text: 'There is an event near you',
        image: 'https://picsum.photos/50/50?random=302',
        read: false,
        created_at: Date.now() - 10800000
      }
    ]
    
    return demoNotifications
  },
  async getFollowers(_) {
    // Return demo followers
    const demoFollowers = [
      {
        profile: {
          profile_id: 'follower-1',
          username: 'follower_user1',
          name: 'Follower One',
          profile_picture: 'https://picsum.photos/50/50?random=310',
          isFollowing: true
        }
      },
      {
        profile: {
          profile_id: 'follower-2',
          username: 'follower_user2',
          name: 'Follower Two',
          profile_picture: 'https://picsum.photos/50/50?random=311',
          isFollowing: false
        }
      },
      {
        profile: {
          profile_id: 'follower-3',
          username: 'follower_user3',
          name: 'Follower Three',
          profile_picture: 'https://picsum.photos/50/50?random=312',
          isFollowing: true
        }
      }
    ]
    
    return demoFollowers
  },
  async getPeople(_) {
    // Return demo people for discovery
    const demoPeople = [
      {
        profile_id: 'person-1',
        username: 'madrid_explorer',
        name: 'Madrid Explorer',
        profile_picture: 'https://picsum.photos/50/50?random=320',
        followers: 128,
        description: 'Urban explorer of Madrid'
      },
      {
        profile_id: 'person-2',
        username: 'art_lover',
        name: 'Art Lover',
        profile_picture: 'https://picsum.photos/50/50?random=321',
        followers: 95,
        description: 'Art and culture lover'
      },
      {
        profile_id: 'person-3',
        username: 'food_blogger',
        name: 'Food Blogger',
        profile_picture: 'https://picsum.photos/50/50?random=322',
        followers: 203,
        description: 'Food blogger'
      },
      {
        profile_id: 'person-4',
        username: 'music_fan',
        name: 'Music Fan',
        profile_picture: 'https://picsum.photos/50/50?random=323',
        followers: 76,
        description: 'Music lover and concert attendee'
      }
    ]
    
    return demoPeople
  },
  async getRrssContacts({ commit }) {
    // Demo mode - simulate social contacts
    const lastRrssChecked = localStorage.getItem('lastRrssChecked')

    if (lastRrssChecked) {
      const date = new Date(lastRrssChecked * 1)
      const diff = new Date() - date

      // Check if last check was less than a week ago
      if (diff < (3600000 * 24 * 7)) {
        return
      }
    }
    
    const demoContacts = [
      {
        profile_id: 'contact-1',
        username: 'social_contact1',
        name: 'Social Contact',
        profile_picture: 'https://picsum.photos/50/50?random=330',
        follow: false
      },
      {
        profile_id: 'contact-2',
        username: 'social_contact2',
        name: 'Another Contact',
        profile_picture: 'https://picsum.photos/50/50?random=331',
        follow: false
      }
    ]
    
    commit('setRrssContacts', demoContacts)
    localStorage.setItem('lastRrssChecked', Date.now())
  },
  async userAutocomplete(_, searchText) {
    // Return demo user search results
    const demoResults = [
      {
        profile_id: 'search-user-1',
        username: 'search_' + searchText,
        name: 'Search User',
        profile_picture: 'https://picsum.photos/50/50?random=340'
      },
      {
        profile_id: 'search-user-2',
        username: searchText + '_madrid',
        name: 'Madrid User',
        profile_picture: 'https://picsum.photos/50/50?random=341'
      }
    ]
    
    return demoResults.filter(user => 
      user.username.toLowerCase().includes(searchText.toLowerCase())
    )
  },
  async findUsers(_, text) {
    // Return demo user search results
    const demoUsers = [
      {
        profile_id: 'found-user-1',
        username: 'found_' + text,
        name: 'Found User',
        profile_picture: 'https://picsum.photos/50/50?random=350',
        followers: 64
      },
      {
        profile_id: 'found-user-2',
        username: text + '_explorer',
        name: 'Explorer User',
        profile_picture: 'https://picsum.photos/50/50?random=351',
        followers: 89
      }
    ]
    
    return demoUsers.filter(user => 
      user.username.toLowerCase().includes(text.toLowerCase())
    )
  },
  async follow(_, userId) {
    // Demo mode - always succeed
    return true
  },
  async unfollow(_, userId) {
    // Demo mode - always succeed
    return true
  },
  async updateProfile({ commit }, profile) {
    // Demo mode - update local state
    commit('auth/updateProfile', profile, { root: true })
    return true
  },
  async updateProfilePicture(_, profilePicture) {
    // Demo mode - always succeed
    return true
  },
  async readNotifications({ rootState }) {
    // Demo mode - mark all notifications as read
    rootState.auth.user.notifications = rootState.auth.user.notifications.map(notification => ({
      ...notification,
      read: true,
    }))
    return true
  },
  async sendNotificationToken(_, token) {
    // Demo mode - always succeed
    return true
  }
}
