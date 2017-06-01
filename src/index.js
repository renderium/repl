import { perfMonitor } from 'lib'
import App from './components/app.html'
import Playground from './playground.js'
import Api from './api.js'

var view = new App({
  target: document.body
})

var api = new Api()

window.playground = new Playground({
  view,
  api
})

perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler('digest')
