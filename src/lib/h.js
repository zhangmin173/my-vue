export function h(type, attrs, children) {
  return new VNode(type, attrs, children)
}

class VNode {
  constructor(tag, data, children) {
    this.type = tag
    this.data = data
    if (Array.isArray(children)) {
      this.children = children
    } else {
      this.text = children
    }
    this.key = data && data.key
  }
}