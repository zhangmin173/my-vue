export function patch(prevVnode, vNode, parentElm) {
  if (prevVnode) {
    if (prevVnode !== vNode) {
      patchNode(prevVnode, vNode)
    }
  } else {
    createElm(vNode, parentElm)
  }

  return vNode.elm
}

function patchNode(oldVnode, vNode) {
  if (oldVnode === vNode) return
  const elm = vNode.elm = oldVnode.elm
  // 更新节点的data

  const oldCh = oldVnode.children
  const ch = vNode.children

  if (!vNode.text) {
    if (oldCh && ch) {
      // 子节点更新
      if (oldCh !== ch) updateChildren(elm, oldCh, ch)
    } else if (ch) {
      // 原来没有子节点，则直接添加节点
      createElm(ch, elm)
    } else if (oldCh) {
      // 现在没有子节点，则直接删除节点
      removeNodes(oldCh, elm)
    } else if (oldVnode.text) {
      // 都不存在子节点，但是之前存在文本节点
      elm.textContent = ''
    }
  } else if (oldVnode.text !== vNode.text) {
    elm.textContent = vNode.text
  }
}

function removeNodes(children, elm) {
  for (let i = 0; i < children.length; i++) {
    elm.removeChild(children[i])
  }
}

function sameVnode(a, b) {
  return a.type === b.type && a.key === b.key
}

function updateChildren(elm, oldCh, ch) {
  let oldStartId = 0,
    oldEndId = oldCh.length - 1,
    oldStartNode = oldCh[0],
    oldEndNode = oldCh[oldEndId],
    startId = 0,
    endId = ch.length - 1,
    startNode = ch[0],
    endNode = ch[endId]

  while(oldStartId <= oldEndId && startId <= endId) {
    if(!oldStartNode) {
      oldStartNode = oldCh[++oldStartId]
    } else if (!oldEndNode) {
      oldEndNode = oldCh[--oldEndId]
    } else if (sameVnode(oldStartNode, startNode)) {
      // 头相同
      patchNode(oldStartNode, startNode)
      oldStartNode = oldCh[++oldStartId]
      startNode = ch[++startId]
    } else if (sameVnode(oldEndNode, endNode)) {
      // 尾相同
      patchNode(oldEndNode, endNode)
      oldEndNode = oldCh[--oldEndId]
      endNode = ch[--endId]
    } else if (sameVnode(oldStartNode, endNode)) {
      // 老头 旧尾
      patchNode(oldStartNode, endNode)
      document.insertBefore(elm, oldStartNode.elm, oldEndNode.elm.nextSibling())
      oldStartNode = oldCh[++oldStartId]
      endNode = ch[--endId]
    } else if (sameVnode(oldEndNode, startNode)) {
      // 老尾 新头
      patchNode(oldEndNode, startNode)
      document.insertBefore(elm, oldEndNode.elm, oldStartNode.elm)
      oldEndNode = oldCh[--oldEndId]
      startNode = ch[++startId]
    }
  }

  if (oldStartId > oldEndId) {
    // 存在新节点未比对，则直接新增
    for (let i = startId; i <= endId; i++) {
      createElm(ch[i], elm)
    }
  } else if (startId > endId) {
    // 存在老节点未比对，则直接删除
    for (let i = oldStartId; i <= oldEndId; i++) {
      removeNode(oldCh[i].elm)
    }
  }
}

function removeNode(el) {
  el.parentNode.removeChild(el)
}

function createElm(vNode, parentElm) {
  vNode.elm = document.createElement(vNode.type)
  createChildren(vNode, vNode.children)
  insert(parentElm, vNode)
}

function createChildren(vNode, children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      createElm(children[i], vNode.elm)
    }
  } else {
    vNode.elm.textContent = vNode.text
  }
}

function insert(parentElm, vNode) {
  // document.insertBefore(vNode.elm, parentElm)
  parentElm.appendChild(vNode.elm)
}