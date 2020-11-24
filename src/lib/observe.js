import Dep from "./dep"
import { isObject } from "./utils"

export default class Observe {
  constructor(value) {
    this.value = value
    this.dep = new Dep()

    if (Array.isArray(value)) {
      // 如果是数组
    } else {
      // 否则是对象
      this.walk(value)
    }
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

  return new Observe(data)
}

function defineReactive(obj, key, value) {
  const dep = new Dep()
  // 递归获取响应式对象
  const childOb = observe(value)

  Object.defineProperty(obj, key, {
    get () {
      console.log(key + ': get')
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
      console.log(key + ': set')
      value = newValue
      dep.notify()
    }
  })
}