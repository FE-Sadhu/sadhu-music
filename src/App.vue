<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import mHeader from './components/m-header/m-header'
import Tab from './components/tab/tab'

export default {
  components: {
    mHeader,
    Tab
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
#app
  background: $color-background
  color white
</style>
