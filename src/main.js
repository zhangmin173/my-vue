import Vue from './lib'

const app = new Vue({
  el: '#app',
  data: {
    message: 1,
    user: {
      name: 'vue',
      age: 18
    }
  },
  render (h) {
    return h('div', {
      className: 'container'
    }, [
      h('p', {}, this.message),
      h('p', {}, this.user.name)
    ])
  }
})

app.mount()

setTimeout(() => {
  app.message += app.message
}, 1000)

// app.$data.user.name = 'zm'