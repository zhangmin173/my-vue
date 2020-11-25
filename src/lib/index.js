import Watcher from './watcher'
import Observe from './observe'
import { h } from './h'
import { patch } from './patch'

export default class Vue {
  constructor (options) {
    const vm = this
    vm.$options = options

    vm.$createElement = h
    vm._watchers = []

    // observe
    this.initData(vm)
    // proxy
    this.proxy(vm, options.data)
  }

  __patch__(prevVnode, vNode, vm) {
    if (prevVnode.nodeType) {
      // 首次渲染
      return patch(null, vNode, vm.$el)
    } else {
      // 更新
      return patch(prevVnode, vNode, vm.$el)
    }
  }

  // 渲染函数
  _render() {
    const vm = this

    const { render } = vm.$options
    const vnode = render.call(vm, vm.$createElement)
    return vnode
  }

  // 更新函数
  _update(vnode) {
    const vm = this
    // dom
    const prevEl = vm.$el
    // vnode
    const prevVnode = vm._vnode

    vm._vnode = vnode

    if (!prevVnode) {
      // 之前的vnode不存在，则是初始化
      vm.$el = vm.__patch__(prevEl, vnode, vm)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode, vm)
    }
  }

  initData(vm) {
    const data = vm.$options.data
    vm._data = data
    const keys = Object.keys(data)
    let i = keys.length
    while(i--) {
      // 将属性代理到实例上
      this.proxy(vm, '_data', keys[i])
    }
    // 修改属性为响应式
    new Observe(data)
  }

  proxy(vm, sourceKey, key) {
    Object.defineProperty(vm, key, {
      get () {
        return vm[sourceKey][key]
      },
      set (newValue) {
        vm[sourceKey][key] = newValue
      }
    })
  }

  mount (el) {
    el = el ? document.querySelector(el) : undefined
    return mountComponent(this, el)
  }
}

function mountComponent(vm, el) {
  vm.$el = el
  const updateComponent = () => {
    vm._update(vm._render())
  }
  vm._watcher = new Watcher(vm, updateComponent)
}
