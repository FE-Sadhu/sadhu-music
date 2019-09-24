<template>
  <div class="rank" ref="rank">
    <scroll ref="toplist" class="toplist" :data="topList">
      <ul>
        <li class="item" @click="selectItem(item)" v-for="(item, index) in topList" :key="index">
          <div class="icon">
            <img height="100" width="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="song in item.songList" :key="song.rank">
              <span>{{song.rank}} </span>
              <span>{{song.title}}-{{song.singerName}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getRank } from 'api/rank'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getRank()
  },
  methods: {
    handlePlayList (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getRank () {
      getRank().then(res => {
        this.topList = this._normallizeRankData(res.req_0.data.group)
        // console.log(this.topList)
      })
    },
    _normallizeRankData (list) {
      const ret = []
      list.forEach((items) => {
        items.toplist.forEach((item) => {
          ret.push({
            id: item.topId,
            listenNum: item.listenNum,
            picUrl: item.frontPicUrl,
            songList: item.song,
            topTitle: item.title,
            type: item.topType,
            avatar: item.mbFrontPicUrl,
            period: item.period
          })
        })
      })
      return ret
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
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

  .rank
    position fixed
    top 88px
    left 0
    right 0
    bottom 0
    .toplist
      height 100%
      overflow hidden
      .item
        display flex
        margin 0 20px
        padding-top 20px
        height 100px
        &:last-child
          padding-bottom 20px
        .icon
          flex 0 0 100px
          width 100px
          height 100px
        .songlist
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          height 100px
          overflow hidden
          background $color-highlight-background
          color $color-text-d
          font-size $font-size-small
          .song
            no-wrap()
            line-height 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
