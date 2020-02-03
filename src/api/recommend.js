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
import { _paramsSerializer } from 'common/js/utils'

const debug = process.env.NODE_ENV !== 'production'

export function getSlider () {
  const url = debug ? '/api/getSlider' : 'http://ptuyxr.cn/music/api/getSlider'
  // const url = '/api/getSlider'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    inCharset: 'utf8',
    format: 'json',
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    data: {
      'comm': { 'ct': 24 },
      'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' },
      'recomPlaylist': {
        'method': 'get_hot_recommend',
        'param': { 'async': 1, 'cmd': 2 },
        'module': 'playlist.HotRecommendServer'
      },
      'playlist': {
        'method': 'get_playlist_by_category',
        'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 },
        'module': 'playlist.PlayListPlazaServer'
      },
      'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } },
      'new_album': {
        'module': 'newalbum.NewAlbumServer',
        'method': 'get_new_album_info',
        'param': { 'area': 1, 'sin': 0, 'num': 10 }
      },
      'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} },
      'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} },
      'focus': { 'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {} }
    }
  })

  return axios.get(url, {
    params: data,
    paramsSerializer: _paramsSerializer
  }).then(res => {
    return res.data
  })
}

export function getList () {
  const url = debug ? '/api/getList' : 'http://ptuyxr.cn/music/api/getList'
  // const url = '/api/getList'

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

export function getDissSongList (id) {
  const url = debug ? '/api/getDissSong' : 'http://ptuyxr.cn/music/api/getDissSong'
  // const url = '/api/getDissSong'

  const data = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: id,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
