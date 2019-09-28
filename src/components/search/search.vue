<template>
  <transition appear name="slide">
    <div class="search">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="head-title">搜你想搜~</h1>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut-wrapper" ref="shorcutWrapper" v-show="!query">
        <scroll :refreshDelay="refreshDelay" class="shortcut" ref="shortcut" :data='listenData'>
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <search-list @delete="deleteOne" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </div>
        </scroll>
      </div>
      <div ref="searchResult" class="search-result" v-show="query">
        <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
      </div>
      <confirm
        ref="confirm"
        title="是否清空所有搜索历史"
        confirmBtnText='清空'
        @confirm="clearSearchHistory"
      ></confirm>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { getSearchHot } from 'api/search'
import { mapActions } from 'vuex'
import { playlistMixin, searchMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  data () {
    return {
      hotKey: [],
      refreshDelay: 100
    }
  },
  computed: {
    listenData () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  created () {
    this._getHot()
  },
  methods: {
    handlePlayList (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.shorcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    back () {
      this.$router.back()
    },
    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    _getHot () {
      getSearchHot().then(res => {
        this.hotKey = res.data.hotkey.slice(0, 10)
      })
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixins'

.search
  position absolute
  top 0
  bottom 0
  width 100%
  z-index 100
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    opacity 0
    transform translate3d(100%, 0, 0)
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      transform rotate(180deg)
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .head-title
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
  .search-box-wrapper
    margin 60px 20px 20px 20px
  .shortcut-wrapper
    position fixed
    top 138px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-g
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 32px
          border 1px solid #d3d4da
          font-size $font-size-medium
          color $color-text
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-g
          .text
            flex 1
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
  .search-result
    position fixed
    width 100%
    top 120px
    bottom 0
</style>
