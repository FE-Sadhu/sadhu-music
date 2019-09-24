// 为了重写 axios 里的 paramsSerialize

var toString = Object.prototype.toString

function isArray (val) {
  return toString.call(val) === '[object Array]'
}

function isObject (val) {
  return val !== null && typeof val === 'object'
}

function isDate (val) {
  return toString.call(val) === '[object Date]'
}

function forEach (obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /* eslint no-param-reassign:0 */
    obj = [obj]
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      // eslint-disable-next-line no-useless-call
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // eslint-disable-next-line no-useless-call
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

// 重写 paramsSerializer 为 _paramsSerializer
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

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 这是洗牌算法
function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function debounce (fun, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}

export {
  isArray,
  isObject,
  isDate,
  forEach,
  _paramsSerializer,
  shuffle,
  debounce
}
