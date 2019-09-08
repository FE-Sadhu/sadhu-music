// const xhr = new XMLHttpRequest()
// const url = '/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

// xhr.open('GET', url, true)
// xhr.timeout = 5000
// xhr.ontimeout = function () {
//   console.log('oops, 请求超时')
// }
// xhr.onload = function () {
//   if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
//     console.log(xhr.response)
//     console.log(xhr.getAllResponseHeaders())
//   }
// }
// xhr.send()
// 以上代码作 nginx 反向代理用，未成功，代以后测试。
// 以下代码是在 webpack 配置 devServer ，从服务器向服务器发送 ajax 请求则无同源策略限制。

import axios from 'axios'
import { commonParams } from './config'

export function getSlider () {
  const url = '/api/getSlider'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getList () {
  const url = '/api/getList'

  const data = Object.assign({}, commonParams, {
    picmid: 1,
    hostUin: 0,
    uin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 19
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
