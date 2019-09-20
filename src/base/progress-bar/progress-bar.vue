<template>
  <div class="progress-bar" ref="progressBar" @click="processClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'

const BTN_WIDTH = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX // 手指第一下点上去的横向的坐标
      this.touch.left = this.$refs.progress.clientWidth // button 所在的偏移的位置
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const diffX = e.touches[0].pageX - this.touch.startX // 按钮纵向move偏移量
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - BTN_WIDTH, Math.max(0, this.touch.left + diffX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    processClick (e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent () { // trigger n.触发
      const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH
        const offsetWidth = barWidth * newPercent
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>