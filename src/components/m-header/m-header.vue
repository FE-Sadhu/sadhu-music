<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">Sadhu Music</h1>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixins"
  .header
    position relative
    height 44px
    text-align center
    color $color-theme
    font-size 0
    .icon
      display inline-block
      vertical-align top
      width 30px
      height 32px
      margin-top 6px
      margin-right 9px
      bg-image('logo')
      background-size 30px 32px
    .text
      display inline-block
      font-size $font-size-large
      line-height 44px
      vertical-align top
</style>
