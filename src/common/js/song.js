import { getLyric } from 'api/song'
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

export function creatSong (musicData, url) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    name: musicData.name,
    album: musicData.album.name,
    singer: filterSinger(musicData.singer),
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url
  })
}

function filterSinger (singer) {
  const ret = []
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}
