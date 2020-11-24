# vue 源码

手写 Vue 源码，梳理各个模块的功能及具体实现

## 基础原理

- 对 options 中的 data 进行劫持（使用 Object.defineProperty 递归设置每个 key 的 getter 和 setter 操作）
- render 函数生成 VNode（可手写render或者编译生成）
- render 过程中因为对数据进行了 get 操作（触发了依赖收集）
- update 函数根据 VNode 对 oldVNode 进行 patch（未挂载之前不存在 patch）
- 当数据改变的时候，触发了 setter 操作，导致 render/update 重新执行

![此处需要一张图解]()