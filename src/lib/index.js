import Watcher from './watcher'
import Observe from './observe'
import { popTarget } from './dep'

export { h } from './h'

export default class Vue {
  constructor (options) {
    const vm = this
    vm.$options = options
    vm.$data = options.data

    vm.render = () => {
      vm.watcher = new Watcher(vm)
      vm.$el = options.render.call(vm)
      popTarget()
      vm.watcher.cleanupDeps()
    }

    // observe
    this.observe(vm)
    // proxy
    this.proxy(vm, options.data)
  }

  observe(vm) {
    new Observe(vm.$data)
  }

  proxy(vm, data) {
    
  }

  mount () {
    this.render()
    const el = document.querySelector(this.$options.el)
    el.appendChild(this.$el)
    return this
  }
}
