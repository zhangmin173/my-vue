export function h(type, attrs, children) {
  return new VNode(type, attrs, children)
}

class VNode {
  constructor(tag, data, children) {
    this.type = tag
    this.data = data
    this.children = children
  }
}