export default class Dep {
  constructor () {
    this.subs = []
  }

  // 收集依赖
  depend() {
    // Dep.target 是一个 Watcher 实例
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  // 执行依赖
  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// 每次 new Watcher 的时候会设置当前的 target
Dep.target = null

// 组件是嵌套 由外向内渲染
// 所以在渲染当前组件的时候，可能存在新的组件，就存在新的 Watcher 实例，用栈保证顺序
const targetStack = []

export function pushTarget(target) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = target
}

export function popTarget() {
  Dep.target = targetStack.pop()
}

function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
