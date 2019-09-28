<template>
  <div>
    <ul>
      <li @click="selectItem(item, index)" class="li-item" v-for="(item, index) in songs" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{desc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem (item, index) {
      this.$emit('select', item, index) // 点击的是哪首歌(item),它在歌曲 songs 数组的索引是什么(index)
    },
    desc (song) {
      return `${song.singer}·${song.album}`
    },
    getRankCls (index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText (index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixins'

  .li-item
    display flex
    font-size $font-size-large
    height 64px
    box-sizing border-box
    align-items center
    .rank
      flex 0 0 25px
      width 25px
      margin-right 30px
      text-align center
      .icon
        display inline-block
        width 25px
        height 24px
        background-size 25px 24px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color #999999
        font-size $font-size-large
    .content
      flex 1
      line-height 20px
      overflow hidden
      .name
        no-wrap()
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        margin-top 4px
        color $color-text-g
</style>
