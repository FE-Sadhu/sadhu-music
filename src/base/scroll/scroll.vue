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
    },
    pullup: { // 是否上拉加载
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
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

      if (this.pullup) {
        this.bs.on('scrollEnd', () => { // scrollEnd 表示 scroll 停止了 滚动结束
          if (this.bs.y <= this.bs.maxScrollY + 50) { // 这个判断条件代表 是否“快要滚动到底部了？” 这里的 50px 是自己定义的 在滚动到距离底部 50px 时触发
            this.$emit('scrollToEnd') // 这里 scrollToEnd 语义化表示滚动到底部了
          }
        })
      }

      if (this.beforeScroll) {
        this.bs.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
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
    scrollTo () {
      this.bs && this.bs.scrollTo.apply(this.bs, arguments)
    },
    scrollToElement () {
      this.bs && this.bs.scrollToElement.apply(this.bs, arguments)
    }
  },
  watch: {
    data () {
      // setTimeout(() => {
      //   this.refresh()
      // console.log('2')
      // }, 20)
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
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
