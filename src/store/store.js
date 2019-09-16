import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dit/logger' // 一个输出修改日志的 vuex 插件

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 当 webpack 编译的时候，开发环境时，debug 为 true

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug, // 开发环境时，当检测到不是通过 commit mutations 的方式去修改 state 里面的数据的话，配置了这项，就会提示报错
  plugins: debug ? [createLogger()] : []
})
