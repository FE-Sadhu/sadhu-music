export default class Singer {
  constructor ({ id, name, pic }) {
    this.name = name
    this.id = id
    this.pic = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.id}.jpg?max_age=2592000`
  }
}
