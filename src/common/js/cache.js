import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 这是内部值的编码习惯
const SEARCH_MAX_LENGTH = 15

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val) // 插入到数组第一个位置
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch (query) { // 把 query 存在本地 localstorage 中，存完后返回所有历史 query 组成的数组
  let searches = storage.get(SEARCH_KEY, []) // 默认值空数组
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches) // 存进本地 localstorage
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
