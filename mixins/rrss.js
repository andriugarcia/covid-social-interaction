export default {
  data() {
    return {
      rules: {
        checkTwitter(url) {
          return (
            url.match(/^[a-zA-Z0-9_]+$/) ||
            url.match(/(https?:\/\/)*(www.)*twitter.com\/([A-Za-z0-9_]+)/) ||
            "Este enlace no es válido"
          )
        },
        checkFacebook(url) {
          return (
            url.match(/^[a-zA-Z0-9_]+$/) ||
            url.match(/(https?:\/\/)*(www.)*facebook.com\/([A-Za-z0-9_]+)/) ||
            "Este enlace no es válido"
          )
        },
        checkInstagram(url) {
          return (
            url.match(/^[a-zA-Z0-9_]+$/) ||
            url.match(/(https?:\/\/)*(www.)*instagram.com\/([A-Za-z0-9_]+)/) ||
            "Este enlace no es válido"
          )
        },
        checkLinkedin(url) {
          return (
            url.match(/^[a-zA-Z0-9_]+$/) ||
            url.match(/(https?:\/\/)*(www.)*linkedin.com\/in\/([A-Za-z0-9_]+)/) ||
            "Este enlace no es válido"
          )
        },
        checkTiktok(url) {
          return (
            url.match(/^[a-zA-Z0-9_]+$/) ||
            url.match(/(https?:)*\/\/(www.)*tiktok.com\/@\/([A-Za-z0-9_]*)/)
          )
        },
        checkSnapchat(url) {
          return (
            url.match(/^[a-zA-Z0-9_]+$/) ||
            url.match(/(https?:)*\/\/(www.)*snapchat.com\/add\/([A-Za-z0-9_]*)/)
          )
        },
        checkUrl(url) {
          return (
            url.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)
          )
        },
      }
    }
  },
  methods: {
    checkTwitter(url) {
      console.log("URL", url)
      return (
        url.match(/^[a-zA-Z0-9_]+$/) ||
        url.match(/(https?:)*\/\/(www.)*twitter.com\/([A-Za-z0-9_]*)/)
      )
    },
    checkFacebook(url) {
      return (
        url.match(/^[a-zA-Z0-9_]+$/) ||
        url.match(/(https?:)*\/\/(www.)*facebook.com\/([A-Za-z0-9_]*)/)
      )
    },
    checkInstagram(url) {
      return (
        url.match(/^[a-zA-Z0-9_]+$/) ||
        url.match(/(https?:)*\/\/(www.)*instagram.com\/([A-Za-z0-9_]*)/)
      )
    },
    checkLinkedin(url) {
      return (
        url.match(/^[a-zA-Z0-9_]+$/) ||
        url.match(/(https?:)*\/\/(www.)*linkedin.com\/in\/([A-Za-z0-9_]*)/)
      )
    },
    checkTiktok(url) {
      return (
        url.match(/^[a-zA-Z0-9_]+$/) ||
        url.match(/(https?:)*\/\/(www.)*tiktok.com\/@\/([A-Za-z0-9_]*)/)
      )
    },
    checkSnapchat(url) {
      return (
        url.match(/^[a-zA-Z0-9_]+$/) ||
        url.match(/(https?:)*\/\/(www.)*snapchat.com\/add\/([A-Za-z0-9_]*)/)
      )
    },
    checkUrl(url) {
      return (
        url.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)
      )
    },
    getChannel(url) {
      if (this.checkTwitter(url)) {
        return 'twitter'
      } else if (this.checkFacebook(url)) {
        return 'facebook'
      } else if (this.checkInstagram(url)) {
        return 'instagram'
      } else if (this.checkLinkedin(url)) {
        return 'linkedin'
      } else {
        return 'other'
      }
    }
  }
}