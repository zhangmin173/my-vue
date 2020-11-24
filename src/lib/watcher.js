import { pushTarget, popTarget } from './dep'

export default class Watcher {
  constructor (vm, expOrFun) {
    this.vm = vm
    vm._watchers.push(this)

    if (typeof expOrFun === 'function') {
      // function 为组件的渲染watcher
      this.getter = expOrFun
    } else {
      // 其他watcher
    }

    // id 和 dep 分开存储，应该是为了计算效率
    this.newDepIds = new Set()
    this.newDeps = []

    this.depIds = new Set()
    this.deps = []

    this.value = this.get()
  }

  get() {
    // 入栈
    pushTarget(this)
    const vm = this.vm
    const value = this.getter.call(vm, vm)
    // 出栈
    popTarget()
    this.cleanupDeps()
    return value
  }

  addDep(dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.depend()
      }
    }
  }

  cleanupDeps() {
    let i = this.deps.length
    while(i--) {
      const dep = this.deps[i]
      // 如果依赖ID，不在本次计算中，就从原来的依赖中移除当前watcher
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    // 交换
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp

    // 清除的是老的依赖ID
    this.newDepIds.clear()

    // 交换
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp

     // 清除的是老的依赖，数组通过设置 length 来 reset
     this.newDeps.length = 0
  }

  update() {
    this.value = this.get()
  }
}