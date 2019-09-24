import { playMode } from 'common/js/config'
import { loadSearch } from 'common/js/cache'

const state = {
  singer: {},
  playing: false, // 播放就是 true
  fullScreen: false, // 全屏
  playList: [], // 播放列表
  sequenceList: [], // 排序播放列表
  mode: playMode.sequence, // 播放的模式： 顺序或其他的,默认为顺序播放
  currentIndex: -1, // 当前播放的索引 =》 (控制前进后退播放那些的)
  disc: {},
  topList: [],
  searchHistory: loadSearch()
}

export default state
