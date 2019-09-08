<template>
  <div class="recommend-wrapper" ref="scroll">
    <div class="recommend-content">
      <div v-if="sliders.length" class="slide-wrapper">
        <swiper :options="swiperOption">
            <swiper-slide v-for="item in sliders" :key="item.id">
              <a :href="item.linkUrl"><img @load="loadImage" :src="item.picUrl" alt=""></a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li
            v-for="item in lists"
            :key="item.dissid"
            class="item-list"
          >
            <div class="avatar">
              <img @load="loadImage" class="image" :src="item.imgurl" alt="">
            </div>
            <div class="text">
              <h2 class="name">{{item.dissname}}</h2>
              <p class="desc">{{item.creator.name}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import { getSlider, getList } from 'api/recommend'

export default {
  created () {
    this._getSlider()
    this._getList()
  },
  beforeDestroy () {
    this.bs.destroy()
  },
  data () {
    return {
      sliders: [],
      lists: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true
        },
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        }
      }
    }
  },
  methods: {
    _getList () {
      getList().then(res => {
        this.lists = res.data.list
        // console.log(this.lists);
        // this.$nextTick(() => {
        //   if (!this.bs) {
        //     this.initBS()
        //   } else {
        //     this.bs.refresh()
        //   }
        // })
      })
    },
    _getSlider () {
      getSlider().then(res => {
        this.sliders = res.data.slider
        // console.log(this.sliders)
        this.$nextTick(() => {
          if (!this.bs) {
            this.initBS()
          } else {
            this.bs.refresh()
          }
        })
      })
    },
    initBS () {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollY: true,
        probeType: 3,
        click: true
      })
    },
    loadImage () {
      if ((!this.checkloaded) && this.bs) {
        this.checkloaded = false
        setTimeout(() => {
          this.bs.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"

.recommend-wrapper
  position fixed
  top 88px
  bottom 0
  left 0
  right 0
  overflow hidden
  .recommend-content
    .slide-wrapper >>> .swiper-pagination-bullet
      background rgb(255, 255, 255)
      opacity 0.6
    .slide-wrapper >>> .swiper-pagination-bullet-active
      background rgb(255, 255, 255)
      opacity 0.9
    .slide-wrapper
      overflow hidden
      width 100%
      height 0
      padding-bottom 40%
      img
        width 100%
    .recommend-list
      width 100%
      .list-title
        height 65px
        line-height 65px
        text-align center
        color $color-theme
        font-size 14px
      .item-list
        display flex
        padding 0 20px 20px
        .avatar
          flex: 0 0 60px
          padding-right 20px
          .image
            width 100%
        .text
          flex 1
          display flex
          flex-direction column
          justify-content center
          font-size 14px
          .name
            margin-bottom 10px
          .desc
            color $color-text-d
</style>
