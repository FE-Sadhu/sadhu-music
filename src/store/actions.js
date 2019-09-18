// 一般做异步操作 或者 需要多次对 mutations 操作，那么可以对 mutation 进行封装之类的事情
import * as types from './mutation-types'

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
} // 这里就是对一系列的 Mutation 操作 做封装
