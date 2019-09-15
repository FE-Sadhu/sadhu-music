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

export {
  isArray,
  isObject,
  isDate,
  forEach
}
