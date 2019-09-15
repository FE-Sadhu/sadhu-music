<template>
  <div class="test" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.bs = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // console.log('1')

      if (this.listenScroll) {
        let vm = this
        this.bs.on('scroll', (pos) => {
          vm.$emit('scroll', pos)
        })
      }
    },
    enable () {
      this.bs && this.bs.enable()
    },
    disable () {
      this.bs && this.bs.disable()
    },
    refresh () {
      this.bs && this.bs.refresh()
    },
    scrollToElement (el, time) {
      this.bs && this.bs.scrollToElement(el, time)
    }
  },
  watch: {
    data () {
      // setTimeout(() => {
      //   this.refresh()
      // console.log('2')
      // }, 20)
      this.$nextTick(() => {
        this.refresh()
      })
      // console.log('2')
    }
  },
  mounted () {
    this._initScroll()
  }
}
</script>

<style lang="stylus" scoped>
</style>
