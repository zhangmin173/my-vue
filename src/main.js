import Vue from './lib'

const app = new Vue({
  el: '#app',
  data: {
    message: 1,
    user: {
      name: 'vue',
      age: 18
    },
    list: [{ id: 0, name: 'zm' }, { id: 1, name: 'kj' }]
  },
  render (h) {
    const lists = this.list.map(item => h('p', {}, item.name))
    return h('div', {
      className: 'container'
    }, lists)
  }
})

app.mount('#app')

setTimeout(() => {
  app.list[0].name = '111'
}, 1000)

// app.$data.user.name = 'zm'