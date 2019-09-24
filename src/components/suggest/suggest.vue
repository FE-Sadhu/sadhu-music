<template>
  <Scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" desc=""></loading>
    </ul>
  </Scroll>
</template>

<script>
import { getSearch } from 'api/search'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

const TYPE_SINGER = 'singer'
const perpage = 20 // 每一页返回的歌曲个数

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true, // 传给 scroll 组件判断是否开启上拉加载
      hasMore: true // 一个标志位，判断是否加载完了，上拉后是否需要加载
    }
  },
  methods: {
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.songname}-${this.formatName(item.singer)}`
      }
    },
    formatName (arr) {
      let ret = []
      arr.forEach(item => {
        ret.push(item.name)
      })
      return ret.join('/')
    },
    search (query) {
      this.page = 1 // query 变化后的重置操作
      this.hasMore = true // query 变化后的重置操作
      this.$refs.suggest.scrollTo(0, 0) // query 变化后的重置操作
      // 请求服务端，抓取检索数据
      getSearch(query, this.page, this.showSinger, perpage).then(res => {
        // console.log(res)
        this.result = this._normallizeRes(res.data)
        this._checkMore(res.data)
        // console.log(this.result)
      })
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      getSearch(this.query, this.page, this.showSinger, perpage).then(res => {
        this.result = this.result.concat(this._normallizeRes(res.data))
        this._checkMore(res.data)
      })
    },
    _checkMore (data) {
      const song = data.song
      const length = song.list.length
      if (!length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _normallizeRes (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(data.song.list)
      }
      return ret
    }
  },
  watch: {
    query (newQuery) {
      if (!newQuery) return
      this.search(newQuery)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixins'

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
</style>
