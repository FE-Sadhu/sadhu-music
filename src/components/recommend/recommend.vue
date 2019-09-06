<template>
  <div>
    recommend
  </div>
</template>

<script>
import { getSlider } from 'api/recommend'

export default {
  created () {
    getSlider().then(res => {
      console.log(res)
    })
  }
}
</script>

<style lang="stylus" scoped>
</style>
