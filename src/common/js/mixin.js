// 当有多个组件都需要相同逻辑的话，推荐用 mixin
// 等于把相同逻辑的 js 代码写到 mixin 中，哪个组件有用到的话就添加这个 mixin 到对应组件中
// mixin 插入组件后，会和组件有种 merge 的行为，组件里面的方法会覆盖 mixin 的方法
import { mapGetters } from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(this.playList)
    }
  },
  methods: {
    handlePlayList () { // 组件里面没定义就会抛出这个 error
      throw new Error('组件必须要自己定义 handlePlayList 来覆盖这个 handlePlayList')
    }
  }
}
