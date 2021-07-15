<template lang="pug">
#input.hashtag-textarea
  v-menu(:value='activateAutocomplete', offset-y, :top='top')
    template(#activator)
      #input-overlay.hashtag-textarea__overlay(:style='overlayStyle')
      #input-true-text.hashtag-textarea__true-text(
        ref='textarea',
        wrap='soft',
        :style='trueTextStyle',
        contentEditable='true',
        spellcheck='false'
      )
      .hashtag-textarea__placeholder(
        :style='placeholderTextStyle',
        v-show='shouldShowPlaceholder'
      ) {{ placeholder }}
    v-card(outlined, flat)
      v-list(style='height: 300px')
        v-list-item(
          v-for='(user, i) in userList',
          :key='i',
          @click='updateName(user.username)'
        )
          v-list-item-avatar
            v-img(:src='user.profile_picture')
          v-list-item-content @{{ user.username }}
</template>

<style lang="scss">
$textWidth: 100%;
$textPadding: 0 23px;
// NOTE: Component of hashtag textarea
.hashtag-textarea {
  position: relative;
  overflow: auto;
  background: white;
  min-height: 20px;
  font-weight: lighter;
  height: 100%;
  width: 100%;
  // NOTE: Textarea layout. Fix position
  &__true-text {
    border: 0;
    background: transparent;
    position: absolute;
    top: 0;
    color: transparent;
    caret-color: black;
    outline: none;
  }
  &__overlay {
    -webkit-tap-highlight-color: transparent;
  }
  &__overlay,
  &__true-text {
    padding: $textPadding;
    margin: 0;
    height: 100%;
    width: $textWidth;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
  &__placeholder {
    font-size: 18px;
    padding: $textPadding;
    position: absolute;
    top: 0;
    font-weight: lighter;
    color: #505050;
  }
}
</style>

<script>
export default {
  name: 'VueHashtagTextarea',
  props: {
    value: String,
    option: {
      type: Object,
      default: () => ({
        fontSize: '18px',
        isEditMode: true,
        textColor: 'black',
        hashtagColor: '#F0134D',
        hashtagBackgroundColor: 'white',
      }),
    },
    placeholder: {
      type: String,
      default: `What's Happening?`,
    },
    size: {
      type: String,
      default: `18px`,
    },
    top: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hashtagList: [],
      shouldShowPlaceholder: true,
      focusedHashtagNode: {},
      activateAutocomplete: false,
      autocompleteText: '',
      userList: [],
    }
  },
  mounted() {
    // NOTE: Create Observer. This is called when text content of the target is changed
    const target = document.getElementById('input-true-text')
    const observer = new MutationObserver(this.onObserveElement)
    const config = {
      childList: true,
      characterData: true,
      characterDataOldValue: true,
      subtree: true,
    }

    observer.observe(target, config)
    // NOTE: Display initial content if exist
    target.textContent = this.value
    const overlayElm = document.getElementById('input-overlay')
    const trueInput = document.getElementById('input-true-text')
    overlayElm.addEventListener('click', this.onSelectHashtag, false)

    document
      .getElementById('input-true-text')
      .addEventListener('keypress', (evt) => {
        if (evt.which === 13) {
          evt.preventDefault()
          this.$emit('enter')
        }
      })

    trueInput.addEventListener('paste', function (e) {
      // cancel paste
      e.preventDefault()

      // get text representation of clipboard
      const text = (e.originalEvent || e).clipboardData.getData('text/plain')

      // insert text manually
      document.execCommand('insertHTML', false, text)
    })
  },
  // destroyed() {
  // const overlayElm = document.getElementById('input-overlay')
  // overlayElm.removeEventListener("click", this.onSelectHashtag, false);
  // },
  computed: {
    isSafariBrowser() {
      let isSafariBrowser = false
      const userAgent = window.navigator.userAgent.toLowerCase()

      if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        isSafariBrowser = true
      }

      return isSafariBrowser
    },
    trueTextStyle() {
      const style = {}
      style.fontSize = this.size
      style['z-index'] = this.option.isEditMode ? 2 : -2
      return style
    },
    placeholderTextStyle() {
      const style = {}
      style.fontSize = this.size
      return style
    },
    overlayStyle() {
      const style = {}
      style.color = this.option.textColor
      style.fontSize = this.size
      return style
    },
    hashtagStyle() {
      let style = 'style='
      style += 'color:' + this.option.hashtagColor + ';'
      if (!this.option.isEditMode) {
        style += 'cursor: default;'
      }
      style += '"'
      return style
    },
    regExp() {
      // /\@(?!\,)[\S]+/g
      return /@(?!,)[\S]+/g
    },
  },
  methods: {
    onObserveElement(mutations) {
      mutations.forEach((mutation) => {
        const type = mutation.type
        switch (type) {
          // NOTE: The textContent will be changed in the line, this type is called.
          case 'characterData':
            this.replaceContent()
            break
          // NOTE: The line break will be occured, this type is called.
          case 'childList':
            this.replaceContent()
            break

          default:
            break
        }
      })
      // NOTE: Show / hide placeholder.
      const target = document.getElementById('input-true-text')
      this.shouldShowPlaceholder =
        target.innerHTML === '' || target.innerHTML === '<br>'
    },
    async getUserList(match) {
      this.userList = [
        {
          username: match.substr(1),
          profile_picture: '',
        },
        ...(await this.$store.dispatch(
          'user/userAutocomplete',
          match.substr(1)
        )),
      ]
    },
    updateName(username) {
      this.$refs.textarea.innerHTML = this.$refs.textarea.innerHTML.replace(
        this.autocompleteText,
        '@' + username
      )
    },
    replaceContent() {
      const target = document.getElementById('input-true-text')
      // NOTE: Need to convert html character with escapecharacter
      const content = this.escapeHtml(target.textContent)
      const contentHTML = target.textContent
      // NOTE: Trim line break \n
      const spaceExp = /^\n\n/gm
      const content2 = content.replace(spaceExp, function (match) {
        return '\n'
      })
      // NOTE: Create new text for hashtag highlight to insert element
      //       If debugging on chrome, use content2 above, otherwise
      //       line break point will be failed.
      const srcContent = this.isSafariBrowser ? content : content2
      const self = this

      const replaceContent = srcContent.replace(this.regExp, function (match) {
        if (self.activateAutocomplete) {
          self.autocompleteText = match

          self.getUserList(match)
        }
        const idStr = ' id=' + self.getUniqueStr()
        const result =
          '<a href="/' +
          match.substr(1).toLowerCase() +
          '" ' +
          self.hashtagStyle +
          idStr +
          '>' +
          match +
          '</a>'
        return result
      })

      // NOTE: Apply content into overlay field.
      const insertNode = document.getElementById('input-overlay')
      insertNode.innerHTML = replaceContent
      this.$emit('input', replaceContent)
      this.hashtagList = this.getHashtagList(content)
    },
    escapeHtml(content) {
      const escapeHashMap = {
        '&': '&amp;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
      }
      return content.replace(/[&"<>]/g, function (match) {
        return escapeHashMap[match]
      })
    },
    getHashtagList(value) {
      const result = value.match(this.regExp)
      return result
    },
    getHashtagNodeList() {
      const target = document.getElementById('input-overlay')
      const nodes = []
      const childNodes = target.childNodes
      childNodes.forEach((child) => {
        nodes.push(child)
      })
      return nodes
    },
    getDiffArrayWithIndex(newVal, oldVal) {
      const result = {}

      for (let i = 0; i < newVal.length; i++) {
        if (oldVal.includes(newVal[i])) {
          result.diffValue = newVal[i]
          result.index = i
          break
        }
      }
      return result
    },
    onSelectHashtag(e) {
      const target = e.target
      const tagName = target.tagName
      if (tagName === 'I') {
        this.$emit('onSelectHashtag', target)
      }
    },
    replaceHashtagNodeContent(newValue) {
      this.focusedHashtagNode.textContent = newValue
      const trueTarget = document.getElementById('input-true-text')
      const overlayTarget = document.getElementById('input-overlay')
      trueTarget.textContent = overlayTarget.textContent
    },
    getUniqueStr() {
      const strong = 1000
      return (
        new Date().getTime().toString(16) +
        Math.floor(strong * Math.random()).toString(16)
      )
    },
    getHashtagTargetNode(index) {
      const target = document.getElementById('input-overlay')
      const nodes = target.childNodes
      let count = 0
      let hashtagTarget = {}
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.tagName === 'I') {
          if (index === count) {
            hashtagTarget = node
            break
          }
          count++
        }
      }
      return hashtagTarget
    },
  },
  watch: {
    value(value) {
      if (value === '') {
        const target = document.getElementById('input-true-text')
        target.textContent = ''
      }
    },
    hashtagList(newVal, oldVal) {
      const isEqualVal = JSON.stringify(newVal) === JSON.stringify(oldVal)
      if (!isEqualVal) {
        const hashtagData = {}
        if (newVal === null) {
          this.activateAutocomplete = false
          hashtagData.target = ''
        } else if (oldVal === null) {
          this.activateAutocomplete = true
          // NOTE: Set focused hashtag node
          const hashtagTarget = this.getHashtagTargetNode(0)
          hashtagData.target = hashtagTarget.textContent
          this.focusedHashtagNode = hashtagTarget
        } else if (newVal.length < oldVal.length) {
          this.activateAutocomplete = false
          hashtagData.target = ''
        } else {
          this.activateAutocomplete = true
          // NOTE: Set focused hashtag node
          const diff = this.getDiffArrayWithIndex(newVal, oldVal)
          const index =
            diff.diffValue === undefined ? newVal.length - 1 : diff.index
          const hashtagTarget = this.getHashtagTargetNode(index)
          hashtagData.target = hashtagTarget.textContent
          this.focusedHashtagNode = hashtagTarget
        }

        hashtagData.hashtags = newVal
        this.$emit('onChangeHashtag', hashtagData)
      } else {
        this.activateAutocomplete = false
      }
    },
  },
}
</script>
