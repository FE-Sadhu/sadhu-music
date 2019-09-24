<template>
  <transition appear name="slide">
    <music-list :rank="true" :title="title" :avatar="avatar" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getTopListSong } from 'api/rank'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  created () {
    // console.log(this.topList)
    this._getSong()
  },
  methods: {
    _getSong () {
      if (!this.topList.id) {
        this.$router.push({
          path: '/rank'
        })
        return
      }
      getTopListSong(this.topList.id, this.topList.period).then(res => {
        processSongsUrl(this._normalizeSongs(res.detail.data.songInfoList)).then(songs => {
          this.songs = songs
        })
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
      return this.topList.topTitle
    },
    avatar () {
      return this.topList.avatar
    },
    ...mapGetters([
      'topList'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>
