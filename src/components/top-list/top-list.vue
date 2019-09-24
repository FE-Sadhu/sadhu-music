<template>
  <transition appear name="slide">
    <music-list :rank="true" :title="title" :avatar="avatar" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getTopListSong } from 'api/rank'
import { creatSong } from 'common/js/song'
import { getSongUrl } from 'api/song'

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
        this._normalizeSingerDetail(res.detail.data.songInfoList)
      })
    },
    _normalizeSingerDetail (DData) {
      const ret = []
      const songList = DData
      songList.forEach((item, index) => {
        getSongUrl(item.mid).then(res => {
          const part = res.req_0.data.midurlinfo[0].purl
          const url = part ? 'http://isure.stream.qqmusic.qq.com/' + part : ''
          ret.push(creatSong(item, url))
          if (!songList[index + 1]) {
            this.songs = ret
            console.log(this.songs)
          }
        })
      })
      // return ret // event loop 问题
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
