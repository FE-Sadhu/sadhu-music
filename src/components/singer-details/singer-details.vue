<template>
  <transition appear name="slide">
    <music-list :songs="songs" :title="title" :avatar="avatar"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import musicList from 'components/music-list/music-list'

export default {
  created () {
    this._getSingerDetail()
  },
  data () {
    return {
      songs: []
    }
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === 0) {
          // console.log(res.singer.data.songlist)
          processSongsUrl(this._normalizeSongs(res.singer.data.songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        if (isValidMusic(item.id, item.album.mid, item.pay, item.pay.price_album)) {
          ret.push(createSong(item.id, item.mid, item.name, item.album.name, item.singer, item.interval, item.album.mid, item.url))
        }
      })
      return ret
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
