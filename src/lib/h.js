export function h(type, { className }, children) {
  if (typeof type === 'string') {
    const el = document.createElement(type)
    if (className) {
      el.classList.add(className)
    }
    if (typeof children === 'object') {
      children.forEach(element => {
        el.appendChild(element)
      })
    } else {
      el.textContent = children
    }
    return el
  }
}