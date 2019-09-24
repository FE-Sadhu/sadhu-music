<template>
  <transition appear name="slide">
    <music-list :title="title" :avatar="avatar" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getDissSongList } from 'api/recommend'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) { // 当前页面刷新回退到上一路由
        this.$router.push({
          path: '/recommend'
        })
      }
      getDissSongList(this.disc.dissid).then(res => {
        if (res.cdlist) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(songs => {
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
    title () {
      return this.disc.dissname
    },
    avatar () {
      // console.log(this.disc)
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
