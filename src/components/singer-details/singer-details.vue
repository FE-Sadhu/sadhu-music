<template>
  <transition appear name="slide">
    <div class="singer-detail">
      music-list
    </div>
  </transition>
  
</template>

<script>
export default {
  
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)

div.singer-detail
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 200
  background $color-background
</style>