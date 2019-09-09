import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import fastclick from 'fastclick'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'
import 'swiper/dist/css/swiper.css'

fastclick.attach(document.body)

Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

Vue.config.productionTip = false

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
