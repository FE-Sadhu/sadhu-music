<template>
  <div>
    singer
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'

export default {
  created () {
    getSingerList().then(res => {
      console.log(res)
    })
  }
}
</script>

<style lang="stylus" scoped>
</style>
