/* eslint-disable quotes */
import axios from 'axios'
import { _paramsSerializer } from 'common/js/utils'

const debug = process.env.NODE_ENV !== 'production'

export function getRank () {
  const url = debug ? '/api/getRank' : 'http://ptuyxr.cn/music/api/getRank'
  // const url = '/api/getRank'

  const data = {
    "module": "musicToplist.ToplistInfoServer",
    "method": "GetAll",
    "param": {}
  }
  const common = {
    "g_tk": 5381,
    "uin": 0,
    "format": "json",
    "ct": 23,
    "cv": 0
  }

  return axios.post(url, {
    req_0: data,
    comm: common
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getTopListSong (id, period) {
  const url = debug ? '/api/getTopListSong' : 'http://ptuyxr.cn/music/api/getTopListSong'
  // const url = '/api/getTopListSong'

  const data = {
    '-': `getUCGI${Math.ceil(Math.random() * 10000000000000000)}`,
    g_tk: 1220736819,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      "detail": {
        "module": "musicToplist.ToplistInfoServer",
        "method": "GetDetail",
        "param": {
          "topId": id,
          "offset": 0,
          "num": 100,
          "period": period
        }
      },
      "comm": {
        "ct": 24,
        "cv": 0
      }
    }
  }

  return axios.get(url, {
    params: data,
    paramsSerializer: _paramsSerializer
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
