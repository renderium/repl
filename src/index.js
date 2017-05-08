import App from './components/app.html'

window.app = new App({
  target: document.body,
  data: {
    code: `function foo () {
  console.log('foo')
}`
  }
})
