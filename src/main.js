import Vue, { h } from './lib'

const app = new Vue({
  el: '#app',
  data: {
    message: 1,
    user: {
      name: 'vue',
      age: 18
    }
  },
  render () {
    return h('div', {
      className: 'container'
    }, [
      h('p', {}, this.$data.message),
      h('p', {}, this.$data.user.name)
    ])
  }
})

app.mount()

setTimeout(() => {
  app.$data.message += app.$data.message
}, 1000)

// app.$data.user.name = 'zm'