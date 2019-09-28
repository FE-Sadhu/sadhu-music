<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">Sadhu Music</h1>
    <router-link tag="div" class="search" to="/search">
      <i class="icon-search"></i>
    </router-link>
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
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
      width 20px
      height 22px
      margin-top 10px
      margin-right 5px
      bg-image('logo')
      background-size 20px 22px
    .text
      display inline-block
      font-size $font-size-large
      line-height 44px
      vertical-align top
    .search
      position absolute
      top 0
      right 0
      .icon-search
        display block
        padding 7px
        font-size 30px
        color $color-theme
    .mine
      position: absolute
      top: 0
      left: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
