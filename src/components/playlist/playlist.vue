<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop> <!-- 这里这个 click.stop 仅仅是防止事件冒泡触发父元素的 click 事件，不用加回调 -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
          <!-- 添加歌曲时候，这动画花100ms，然而上层 scroll 传 data refresh 只有20ms，所以 scroll 重新计算 DOM 高度算不对，所以我们要延迟计算 DOM 高度-->
          <transition-group ref="list" name="list" tag="ul">
            <li
              class="item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item, index)"
              ref="listItem"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="favoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" title="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { playMode } from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import { playerMixin } from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'

export default {
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => { // v-show 只是切换 display ，带有 v-show 的元素总是会被渲染并保留在 DOM 中，所以传数据到 scroll refresh 还不够
        this.$refs.listContent.refresh() // 所以应该当这个组件被 show 出来时，再 refresh better-scroll 一次
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((item) => {
        return current.id === item.id
      })

      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne (song) {
      this.deleteSong(song)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.clearSongs()
      this.hide()
    },
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'clearSongs'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }

      setTimeout(() => {
        this.scrollToCurrent(newSong)
      }, 20)
      // this.setPlayingState(true)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixins'

.playlist
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 200
  background-color $color-background-d
  &.list-fade-enter-active, &.list-fade-leave-active
    transition opacity 0.3s
    .list-wrapper
      transition all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  &.list-fade-enter
  .list-wrapper
    position absolute
    left 0
    bottom 0
    width 100%
    background $color-highlight-background
    .list-header
      position relative
      padding 20px 30px 10px 20px
      .title
        display flex
        align-items center
        .icon
          margin-right 10px
          font-size 30px
          color $color-theme-d
        .text
          flex 1
          font-size $font-size-medium
          color $color-text-l
        .clear
          extend-click()
          .icon-clear
            font-size $font-size-medium
            color $color-text-d
    .list-content
      max-height 240px
      overflow hidden
      .item
        display flex
        align-items center
        height 40px
        padding 0 30px 0 20px
        overflow hidden
        &.list-enter-active, &.list-leave-active
          transition: all 0.1s linear
        &.list-enter, &.list-leave-to
          height: 0
        .current
          flex 0 0 20px
          width 20px
          font-size $font-size-small
          color: $color-theme-d
        .text
          flex 1
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d
        .like
          extend-click()
          margin-right 15px
          font-size $font-size-small
          color $color-theme
          .icon-favorite
            color: $color-sub-theme
        .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
    .list-operate
      width 140px
      margin 20px auto 30px auto
      .add
        display flex
        align-items center
        padding 8px 16px
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        .icon-add
          margin-right 5px
          font-size: $font-size-small-s
        .text
          font-size: $font-size-small
    .list-close
      text-align: center
      line-height: 50px
      background: $color-background
      font-size: $font-size-medium-x
      color: $color-text-l
</style>
