<template>
  <div>
    <ul>
      <li class="li-item" v-for="(item, index) in songs" :key="index">
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
