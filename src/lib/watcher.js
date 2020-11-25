import { pushTarget, popTarget } from './dep'

let uid = 0
export default class Watcher {
  constructor (vm, expOrFun) {
    this.vm = vm
    this.id = ++uid
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

  run () {
    console.log('watcher run', this.id)
    this.value = this.get()
  }

  get() {
    // 入栈
    pushTarget(this)
    const vm = this.vm
    const value = this.getter.call(vm)
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
        dep.addSub(this)
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
    queueWatcher(this)
  }
}

function resetSchedulerState () {
  index = queue.length = 0
  has = new Set()
  waiting = flushing = false
}

const queue = []
let has = new Set()

let flushing = false
let waiting = false
// 当前执行下标
let index = 0

function queueWatcher(watcher) {
  if (!has.has(watcher.id)) {
    has.add(watcher.id)
    if (!flushing) {
      // 队列未执行
      queue.push(watcher)
    } else {
      // 队列已执行
      // watcher 创建顺序，总是父级id最小
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      // 当前watcher插入的位置为 未执行的watcher队列中 比当前watcher小的后面
      queue.splice(i + 1, 0, watcher)
    }

    if (!waiting) {
      // 未在等待状态，则执行一次
      waiting = true
      nextTick(flushingQueue)
    }
  }
}

function flushingQueue() {
  flushing = true
  // 排序，保证id最小的先执行
  queue.sort((a, b) => a.id - b.id)

  let watcher, id

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has.delete(id)
    watcher.run()
  }

  resetSchedulerState()
}

const nextTick = (function () {
  const callbacks = []
  let pending = false,
    timerFunc

  function nextTicker() {
    pending = false
    const cbs = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < cbs.length; i++) {
      cbs[i]()
    }
  }

  timerFunc = () => {
    Promise.resolve().then(nextTicker)
  }

  return function(cb) {
    callbacks.push(cb)
    if (!pending) {
      pending = true
      timerFunc()
    }
  }
})()