import * as types from './mutation-types'
// 为什么需要 Mutation-types 做关联，是为了方便有些 Lint 工具检查，避免写错

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
