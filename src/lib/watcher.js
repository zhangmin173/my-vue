import { pushTarget } from './dep'

export default class Watcher {
  constructor (vm, key) {
    this.vm = vm
    this.key = key
    this.deps = []
    // 每次new实例的时候挂载一下
    pushTarget(this)
  }

  addDep(dep) {
    dep.addSub(this)
    this.deps.push(dep)
  }

  cleanupDeps() {
    this.deps = []
  }

  update() {
    this.vm.render()
  }
}