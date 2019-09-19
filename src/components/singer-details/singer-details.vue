<template>
  <transition appear name="slide">
    <music-list :songs="songs" :title="title" :avatar="avatar"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { creatSong } from 'common/js/song'
import { getSongUrl } from 'api/song'
import musicList from 'components/music-list/music-list'

export default {
  created () {
    this._getSingerDetail(this.singer.id)
  },
  data () {
    return {
      songs: []
    }
  },
  methods: {
    _getSingerDetail (singerId) {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(singerId).then(res => {
        // console.log(res)
        // this.songs = this._normalizeSingerDetail(res)
        this._normalizeSingerDetail(res)
      })
    },
    _normalizeSingerDetail (DData) {
      const ret = []
      const songList = DData.singer.data.songlist
      songList.forEach((item, index) => {
        getSongUrl(item.mid).then(res => {
          const part = res.req_0.data.midurlinfo[0].purl
          const url = part ? 'http://isure.stream.qqmusic.qq.com/' + part : ''
          ret.push(creatSong(item, url))
          if (!songList[index + 1]) {
            this.songs = ret
            // console.log(this.songs)
          }
        })
      })
      // return ret // event loop 问题
    }
  },
  computed: {
    ...mapGetters([
      'singer' // 映射了 getter.js 中的 singer 函数来取数据
    ]),
    title () {
      return this.singer.name
    },
    avatar () {
      return this.singer.pic
    }
  },
  components: {
    musicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
