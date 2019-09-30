import axios from 'axios'
import { _paramsSerializer } from 'common/js/utils'

const debug = process.env.NODE_ENV !== 'production'

export function getSingerList () {
  const url = debug ? '/api/getSingerList' : 'http://ptuyxr.cn/music/api/getSingerList'
  // const url = '/api/getSingerList'

  const data = {
    '-': `getUCGI${Math.ceil(Math.random() * 10000000000000000)}`,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      'comm': {
        'ct': 24,
        'cv': 0
      },
      'singerLis': {
        'module': 'Music.SingerListServer',
        'method': 'get_singer_list',
        'param': {
          'area': -100,
          'sex': -100,
          'genre': -100,
          'index': -100,
          'sin': 0,
          'cur_page': 1
        }
      }
    }
  }

  return axios.get(url, {
    params: data,
    paramsSerializer: _paramsSerializer
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail (singerId) {
  const url = debug ? '/api/getSingerDetail' : 'http://ptuyxr.cn/music/api/getSingerDetail'
  // const url = '/api/getSingerDetail'

  const data = {
    '-': `getUCGI${Math.ceil(Math.random() * 10000000000000000)}`,
    g_tk: 952113936,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      'comm': {
        'ct': 24,
        'cv': 0
      },
      'singer': {
        'method': 'get_singer_detail_info',
        'param': {
          'sort': 5,
          'singermid': singerId,
          'sin': 0,
          'num': 100
        },
        'module': 'music.web_singer_info_svr'
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
