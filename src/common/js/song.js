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
