import App from './components/app.html'
import Playground from './playground.js'
import code from './code.js'

var view = new App({
  target: document.body
})

window.playground = new Playground({
  view,
  code
})
