<template lang="pug">
v-card(color='black', style='position: absolute; inset: 0')
  v-layout(style='position: absolute; inset: 0', justify-center, align-center)
    canvas(
      ref='canvas',
      @mousedown='handleMouseDown',
      @mousemove='handleMouseMove',
      @mouseup='handleMouseUp',
      @mouseout='handleMouseOut'
    )
  v-layout.pa-4(dark, style='position: absolute; top: 0; left: 0; right: 0')
    v-btn(icon, dark)
      v-icon fas fa-times
    v-spacer
    v-btn.mx-2(icon, dark)
      v-icon far fa-grin-hearts
    v-btn.mx-2(icon, dark, @click='newTextOpened = true')
      v-icon fas fa-font
    v-btn.mx-2(icon, dark)
      v-icon fas fa-crop-alt

  v-layout.pa-4(
    v-if='!newTextOpened',
    style='position: absolute; bottom: 0; left: 0; right: 0'
  )
    v-spacer
    v-btn(fab, color='primary', dark, @click='confirmImage')
      v-icon fas fa-check
  v-layout.pa-4(
    v-else,
    style='position: absolute; bottom: 0; left: 0; right: 0'
  )
    input.newText(
      type='text',
      v-model='newText.text',
      @keydown.enter='insertText'
    )
</template>

<script>
export default {
  props: ['image'],
  data() {
    return {
      elements: [],
      selectedElement: -1,
      canvasOffset: null,
      startX: null,
      startY: null,
      imageURL: null,

      newTextOpened: false,
      newText: {
        text: '',
        font: 'Rubik',
        size: 32,
        color: 'red',
      },
    }
  },
  mounted() {
    const canvas = this.$refs.canvas
    const ctx = canvas.getContext('2d')
    this.imageURL = URL.createObjectURL(this.image)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.background = 'url(' + this.imageURL + ')'
    this.draw()
  },

  methods: {
    insertText() {
      this.elements.push({
        ...this.newText,
        x: 320,
        y: 180,
      })
      this.draw()
      this.newText.text = ''
    },
    confirmImage() {
      const self = this
      let canvas = this.$refs.canvas
      canvas.toBlob(function (blob) {
        const file = new File([blob], 'image.png', { type: 'image/png' })
        self.$emit('confirm', file)
      })
    },
    handleMouseDown(e) {
      e.preventDefault()
      this.startX = parseInt(e.clientX - this.canvasOffset.left)
      this.startY = parseInt(e.clientY - this.canvasOffset.top)

      // Put your mousedown stuff here
      for (var i = 0; i < this.elements.length; i++) {
        if (this.textHittest(this.startX, this.startY, i)) {
          this.selectedElement = i
        }
      }
    },
    handleMouseMove(e) {
      if (this.selectedElement < 0) {
        return
      }
      e.preventDefault()
      const mouseX = parseInt(e.clientX - this.canvasOffset.left)
      const mouseY = parseInt(e.clientY - this.canvasOffset.top)

      // Put your mousemove stuff here
      var dx = mouseX - this.startX
      var dy = mouseY - this.startY
      this.startX = mouseX
      this.startY = mouseY

      var text = this.elements[this.selectedElement]
      text.x += dx
      text.y += dy
      this.draw()
    },
    handleMouseUp(e) {
      e.preventDefault()
      this.selectedElement = -1
    },
    handleMouseOut(e) {
      e.preventDefault()
      this.selectedElement = -1
    },
    draw() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      var img = new Image()
      const self = this
      img.onload = function () {
        canvas.width = img.width
        canvas.height = img.height
        self.canvasOffset = canvas.getBoundingClientRect()
        ctx.drawImage(
          img,
          canvas.width / 2 - img.width / 2,
          canvas.height / 2 - img.height / 2
        )

        for (var i = 0; i < self.elements.length; i++) {
          var text = self.elements[i]
          console.log('DRAWING', text)
          ctx.font = text.size + 'px ' + text.font
          ctx.fillStyle = text.color
          ctx.textAlign = 'center'
          ctx.fillText(text.text, text.x, text.y)
          text.width = ctx.measureText(text.text).width
          text.height = text.size
        }
      }
      img.src = this.imageURL
    },

    textHittest(x, y, textIndex) {
      var text = this.elements[textIndex]
      return (
        x >= text.x &&
        x <= text.x + text.width &&
        y >= text.y - text.height &&
        y <= text.y
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.newText {
  background-color: transparent;
  border: 0;
}
</style>
