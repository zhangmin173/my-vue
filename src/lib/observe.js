import Dep from "./dep"

export default class Observe {
  constructor(value) {
    this.observe(value)
  }

  observe(value) {
    if (typeof value !== 'object') return value

    const keys = Object.keys(value)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const val = value[key]
      defineReactive(value, key, val)
    }
  }
}

function defineReactive(obj, key, value) {
  const deps = new Dep()
  Object.defineProperty(obj, key, {
    get () {
      console.log(key + ': get')
      if (Dep.target) {
        deps.depend()
      }
      return value
    },
    set (newValue) {
      if (newValue === value) return
      console.log(key + ': set')
      value = newValue
      deps.notify()
    }
  })
}