<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="suggest"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
        @click="selectItem(item)"
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
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import noResult from 'base/no-result/no-result'
import { getSearch } from 'api/search'
import { creatSong } from 'common/js/song'
import { getSongUrl } from 'api/song'
import { mapMutations, mapActions } from 'vuex'

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
      beforeScroll: true, // 兼容 input 框手机端弹出键盘，滑动 suggest 时却关闭不了键盘的问题
      pullup: true, // 传给 scroll 组件判断是否开启上拉加载
      hasMore: true // 一个标志位，判断是否加载完了，上拉后是否需要加载
    }
  },
  methods: {
    selectItem (item) {
      if (item.type) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
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
        return `${item.name}-${item.singer}`
      }
    },
    search (query) {
      this.page = 1 // query 变化后的重置操作
      this.hasMore = true // query 变化后的重置操作
      this.$refs.suggest.scrollTo(0, 0) // query 变化后的重置操作
      this.result = [] // watch query 变化后的重置
      // 请求服务端，抓取检索数据
      getSearch(query, this.page, this.showSinger, perpage).then(res => {
        // console.log(1, res)
        this._normallizeRes(res.data)
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
        // this.result = this.result.concat(this._normallizeRes(res.data))
        this._normallizeRes(res.data)
        this._checkMore(res.data)
      })
    },
    listScroll () {
      this.$emit('listScroll')
    },
    _checkMore (data) {
      const song = data.song
      const length = song.list.length
      if (!length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _normallizeRes (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        const mid = []
        const list = data.song.list
        list.forEach(item => {
          mid.push({
            id: item.songid,
            mid: item.songmid,
            name: item.songname,
            album: {
              name: item.albumname,
              mid: item.albummid
            },
            singer: item.singer,
            interval: item.interval
          })
        })
        mid.forEach((item, index) => {
          getSongUrl(item.mid).then(res => {
            const part = res.req_0.data.midurlinfo[0].purl
            console.log(res)
            const url = part ? 'http://isure.stream.qqmusic.qq.com/' + part : ''
            ret.push(creatSong(item, url))
            if (!mid[index + 1]) {
              console.log(1, this.result)
              if (this.result.length > 0) {
                this.result = this.result.concat(ret.slice(1))
              } else {
                this.result = this.result.concat(ret)
              }
              console.log(2, this.result)
            }
          })
        })
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER' // 把 mutations 里的 SET_SINGER 方法映射到这里成 setSinger
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) return
      this.search(newQuery)
    }
  },
  components: {
    Scroll,
    Loading,
    noResult
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
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
