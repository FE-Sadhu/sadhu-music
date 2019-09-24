// 对 state 里面数据的映射, 希望从 getters 里面去取 state 中数据到组件中

export const singer = state => state.singer

// 上面是箭头函数的缩写，等同于下面的代码
// const singer = function(state) {
//   return state.singer
// }

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory
