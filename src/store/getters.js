// 对 state 里面数据的映射, 希望从 getters 里面去取 state 中数据到组件中

export const singer = state => state.singer

// 上面是箭头函数的缩写，等同于下面的代码
// const singer = function(state) {
//   return state.singer
// }
