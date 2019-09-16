<template>
  <div>
    <scroll
      class="wrapper-singer"
      ref="scroll"
      :probeType="3"
      :data="singers"
      :listenScroll="listenScroll"
      @scroll="scroll"
    >
      <div class="content">
        <div class="chunk" v-for="each in singers" :key="each.title" ref="listGroup">
          <div class="title">{{each.title}}</div>
          <ul>
            <li
              class="item"
              v-for="(singer, index) in each.items"
              :key="index"
              @click="selectItem(singer)"
            >
            <img class="avatar" v-lazy="singer.pic">
            <h2 class="name">{{singer.name}}</h2>
            </li>
          </ul>
        </div>
      </div>
      <ul class="list-shortcut">
        <li
          v-for="(item, index) in singers"
          :key="index"
          :ref="item.title"
          :data-index="index"
          class="list-item"
          :class="{'current' : currentIndex === index}"
          @touchstart.stop.prevent="handleTouchStart"
          @touchmove.stop.prevent="handleTouchMove"
          @touchend.stop="handleTouchEnd"
        >
        {{item.title}}
        </li>
      </ul>
      <div class="fixed-top" ref="fixed" v-show="fixedTitle">
        <div class="fixed-title">{{fixedTitle}}</div>
      </div>
      <div class="loading" v-show="!singers.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { getData } from 'common/js/dom'
import Singer from 'common/js/singer'
import pinyin from 'tiny-pinyin'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapMutations } from 'vuex'

const HOT_NAME = '热'
const HOT_SINGER_LENGTH = 10
const SHORTCUT_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  data () {
    return {
      singers: [],
      touchState: false,
      listHeight: [],
      currentIndex: 0,
      scrollY: -1, // 滚动实时位置
      diff: -1 // 上限与滚动位置的差，用来计算啥时候 title 吸顶
    }
  },
  created () {
    this._getSingerList()
    this.touch = {}
    this.listenScroll = true
  },
  methods: {
    selectItem (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer) // 不用 mapMutations 语法糖的话，就等同于 this.$store.commit('SET_SINGER', singer)
    },
    _getSingerList () {
      getSingerList().then(res => {
        // console.log(res)
        this.singers = this._normalizeSinger(res.singerLis.data.singerlist)
        // console.log(this.singers)
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item) => {
        if (map.hot.items.length < HOT_SINGER_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.singer_mid,
            name: item.singer_name,
            pic: item.singer_pic
          }))
        }

        const key = pinyin.convertToPinyin(item.singer_name).substr(0, 1)

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }

        map[key].items.push(new Singer({
          id: item.singer_mid,
          name: item.singer_name,
          pic: item.singer_pic
        }))
      })

      // 下面是让对象转换为数组，并正确排序 A -> Z
      let ret = []
      let hot = []

      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    },
    handleTouchStart (e) {
      const startIndex = getData(e.target, 'index')
      const firstTouch = e.touches[0]
      this.touch.startIndex = startIndex // 触摸开始的 DOM 元素索引
      this.touch.y1 = firstTouch.pageY // 触摸开始的 DOM 元素相对 html 文档的高度
      this._scrollTo(startIndex)
    },
    handleTouchMove (e) {
      const firstTouch = e.touches[0] // move 结束的元素的 touch 事件
      this.touch.y2 = firstTouch.pageY // move 结束的元素的相对页面的高度
      const diffIndex = Math.floor((this.touch.y2 - this.touch.y1) / SHORTCUT_HEIGHT)
      const ArriveIndex = parseInt(this.touch.startIndex) + diffIndex
      this._scrollTo(ArriveIndex)
    },
    handleTouchEnd () {
    },
    scroll (pos) { // 监听 better-scroll 的 scroll 事件获取滚动时实时位置
      this.scrollY = -pos.y
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = this.listHeight[index]
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 500)
    },
    _calculateHeight () {
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        // console.log(item.clientHeight) // 每个区块对应的视口高度
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER' // 把 mutations 里的 SET_SINGER 方法映射到这里成 setSinger
    })
  },
  watch: {
    singers () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) { // 实时坐标
      const listHeight = this.listHeight
      // 当滚动到顶部， newY<0
      if (newY < 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (newY >= height1 && newY < height2) {
          this.currentIndex = i
          this.diff = height2 - newY
          return
        }
      }
      // 当滚动到底部，且 newY 大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  computed: {
    fixedTitle () {
      if (this.scrollY < 0) {
        return ''
      }
      return this.singers[this.currentIndex] ? this.singers[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.wrapper-singer
  position absolute
  top 88px
  left 0
  right 0
  bottom 0
  overflow hidden
  .content
    .chunk
      padding-bottom 30px
      .title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          flex 0 0 50px
          width 50px
          height 50px
          border-radius 50%
        .name
          flex 1
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
  .list-shortcut
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    z-index 30
    background $color-background-d
    width 20px
    border-radius 10px
    padding 20px 0
    display flex
    flex-direction column
    justify-content center
    font-family Helvetica
    font-size $font-size-small
    text-align center
    .list-item
      padding 3px
      color $color-text-l
      &.current
        color $color-theme
  .fixed-top
    position absolute
    top 0
    left 0
    right 0
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
  .loading
    position absolute
    width 100%
    top: 50%
    transform translateY(-50%)
</style>
