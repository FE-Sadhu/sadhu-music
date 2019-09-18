import axios from 'axios'
import { getUid } from 'common/js/uid'
import { _paramsSerializer } from 'common/js/utils'

export function getSongUrl (songmid) {
  const url = '/api/getSongUrl'

  const guid = getUid()

  const data = {
    '-': `getplaysongvkey${Math.ceil(Math.random() * 10000000000000000)}`,
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
      'req_0': {
        'module': 'vkey.GetVkeyServer',
        'method': 'CgiGetVkey',
        'param': {
          'guid': guid,
          'songmid': [songmid],
          'songtype': [0],
          'uin': '0',
          'loginflag': 1,
          'platform': '20'
        }
      },
      'comm': {
        'uin': 0,
        'format': 'json',
        'ct': 24,
        'cv': 0
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
