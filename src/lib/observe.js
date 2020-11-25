import Dep from "./dep"
import { isObject } from "./utils"

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const proxyMethods = ['push', 'pop']

const proxyArrayMethods = () => {
  proxyMethods.forEach(method => {
    const originMethod = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
      value: function (...args) {
        const result = originMethod.apply(this, args)
        this.__ob__.dep.notify()
        return result
      }
    })
  })
}
proxyArrayMethods()

export default class Observe {
  constructor(value) {
    this.value = value
    this.dep = new Dep()

    Object.defineProperty(value, '__ob__', {
      value: this
    })
    if (Array.isArray(value)) {
      // 如果是数组
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      // 否则是对象
      this.walk(value)
    }
  }

  observeArray(array) {
    array.forEach(item => {
      observe(item)
    })
  }

  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

export function observe(data) {
  if (!isObject(data)) return

  let ob
  if (data.__ob__) {
    ob = data.__ob__
  } else {
    ob = new Observe(data)
  }
  return ob
}

function defineReactive(obj, key, value) {
  const dep = new Dep()
  // 递归获取响应式对象
  const childOb = observe(value)

  Object.defineProperty(obj, key, {
    get () {
      // console.log(key + ': get')
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
    set (newValue) {
      if (newValue === value) return
      // console.log(key + ': set')
      value = newValue
      dep.notify()
    }
  })
}