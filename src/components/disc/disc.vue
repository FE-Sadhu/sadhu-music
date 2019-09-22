<template>
  <transition name="slide">
    <music-list :title="title" :avatar="avatar" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getDissSongList } from 'api/recommend'
import { creatSong } from 'common/js/song'
import { getSongUrl } from 'api/song'

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
      getDissSongList(this.disc.dissid).then(res => {
        this._normallizeSongs(res)
      })
    },
    _normallizeSongs (list) {
      const ret = []
      const songList = list.cdlist[0].songlist
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
