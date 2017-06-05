import { perfMonitor } from 'lib'
import App from './components/app.html'
import Repl from './repl.js'
import Api from './api.js'

var view = new App({
  target: document.body
})

var api = new Api()

window.repl = new Repl({
  view,
  api
})

perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler('digest')
