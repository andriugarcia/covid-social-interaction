export default {
  methods: {
    getIcon(type) {
      switch (type) {
        case 'reply':
          return 'fas fa-comment-dots'
        case 'chat':
          return 'fas fa-comment-dots'
        case 'event':
          return 'fas fa-flag'
        case 'follow':
          return 'fas fa-glass-cheers'
        case 'like':
          return 'fas fa-heart'
      }
    },
  },
}
