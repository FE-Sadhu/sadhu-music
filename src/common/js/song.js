import { getLyric, getSongsUrl } from 'api/song'
import { Base64 } from 'js-base64'

export class Song {
  constructor ({ id, mid, name, album, singer, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.name = name
    this.album = album
    this.singer = singer
    this.duration = duration
    this.image = image
    this.url = url
  }
  getSongLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    // console.log(22)
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong (id, mid, name, album, singer, duration, albummid, url) {
  return new Song({
    id,
    mid,
    name,
    album,
    singer: filterSinger(singer),
    duration,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`,
    url
  })
}

function filterSinger (singer) {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}

export function isValidMusic (id, albummid, pay, pricealbum) {
  return id && albummid && (!pay || pricealbum === 0)
}

export function processSongsUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then((purlMap) => {
    songs = songs.filter((song) => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}
