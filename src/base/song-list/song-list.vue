<template>
  <div>
    <ul>
      <li @click="selectItem(item, index)" class="li-item" v-for="(item, index) in songs" :key="index">
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
    }
  },
  methods: {
    selectItem (item, index) {
      this.$emit('select', item, index) // 点击的是哪首歌(item),它在歌曲 songs 数组的索引是什么(index)
    },
    desc (song) {
      return `${song.singer}·${song.album}`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixins'

  .li-item
    display flex
    font-size $font-size-medium
    height 64px
    box-sizing border-box
    flex-direction column
    justify-content center
    .content
      line-height 20px
      overflow hidden
      .name
        no-wrap()
        color $color-text
      .desc
        no-wrap()
        margin-top 4px
        color $color-text-d
</style>
