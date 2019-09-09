<template>
  <div class="loading">
    <img width="24px" height="24px" src="./loading.gif">
    <p class="desc">{{desc}}</p>
  </div>
</template>

<script>
export default {
  props: {
    desc: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
  .loading
    width 100%
    text-align center
    .desc
      font-size $font-size-small
      line-height 20px
      color $color-text-l
</style>
