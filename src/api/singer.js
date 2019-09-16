import axios from 'axios'

import {
  isArray,
  isObject,
  isDate,
  forEach
} from 'common/js/utils'

export function getSingerList () {
  const url = '/api/getSingerList'

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
    // data: `${encodeURIComponent('{"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}')}`
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
  const url = '/api/getSingerDetail'

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

function _paramsSerializer (params) {
  var parts = []

  forEach(params, function serialize (val, key) {
    if (val === null || typeof val === 'undefined') {
      return
    }

    if (isArray(val)) {
      key = key + '[]'
    } else {
      val = [val]
    }

    forEach(val, function parseValue (v) {
      if (isDate(v)) {
        v = v.toISOString()
      } else if (isObject(v)) {
        v = JSON.stringify(v)
      }
      parts.push(encode(key) + '=' + encode(v))
    })
  })

  return parts.join('&')
}

function encode (val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%24/g, '$').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']')
}
