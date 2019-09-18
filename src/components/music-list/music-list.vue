<template>
  <div class="music-list">
    <div class="back" @click="handleBack">
      <i class="icon iconfont">&#xe609;</i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bgImage" :style="bgStyle" ref="img">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length > 0" class="play">
          <i class="iconfont icon-play">&#xe710;</i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :listenScroll="listenScroll"
      :probeType="probeType"
      :data="songs"
      @scroll="scroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <loading v-show="!songs.length" class="loading"></loading>
    </scroll>
  </div>
</template>

<script>
import songList from 'base/song-list/song-list'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'

const LAYER_HEIGHT = 40
const transform = prefixStyle('transform') // js 版 自动加 css 前缀
const backdrop = prefixStyle('backdrop-filter') // 高斯模糊

export default {
  created () {
    this.listenScroll = true
    this.probeType = 3
  },
  mounted () {
    this.imageHeight = this.$refs.img.clientHeight
    this.minTranslateY = -this.imageHeight + LAYER_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.avatar})`
    }
  },
  watch: {
    scrollY (newVal) {
      const translateY = Math.max(this.minTranslateY, newVal)
      let zIndex = 0
      let scale = 1
      let blur = 0 // css高斯模糊 只有 ios 才有效果 是一种渐进增强
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      if (newVal < this.minTranslateY) { // 当往上移到距离顶部 LAYER_HEIGHT(40px) 后
        zIndex = 10
        this.$refs.img.style.paddingTop = 0
        this.$refs.img.style.height = `${LAYER_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.img.style.paddingTop = '70%'
        this.$refs.img.style.height = 0
        this.$refs.playBtn.style.display = ''
      }

      this.$refs.img.style.zIndex = zIndex
      this.$refs.img.style[transform] = `scale(${scale})`
    }
  },
  methods: {
    handleBack () {
      // this.$router.push('/singer')
      this.$router.back() // 与上面一样的效果
    },
    scroll (newY) {
      this.scrollY = newY.y
      // console.log(this.scrollY)
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  components: {
    songList,
    scroll,
    loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixins'

.music-list
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 100
  background $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon
      display block
      padding 6px 10px 10px 8px
      font-size 30px
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    height 40px
    line-height 40px
    text-align center
    font-size $font-size-large
    color $color-text
    no-wrap()
  .bgImage
    position relative
    width 100%
    height 0
    padding-top 70%
    transform-origin: top // 以 top 顶部的方位，从上到下改变 scale
    background-size cover
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-theme
        color $color-theme
        border-radius 100px
        font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size $font-size-medium-x
        .text
          display inline-block
          vertical-align middle
          font-size $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position relative
    height 100%
    background $color-background
  .list
    position absolute
    top 70vw
    bottom 0
    width 100%
    background $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading
      position absolute
      top 50%
      width 100%
      transform translateY(-50%)
</style>
