import { Renderium, Vector, Animation, perfMonitor } from 'lib'

const raf = window.requestAnimationFrame

raf(function digest (time) {
  perfMonitor.startProfile('digest')
  Animation.animate(time)
  Renderium.digest(time)
  perfMonitor.endProfile('digest')
  raf(digest)
})

class Playground {
  constructor ({ view, api }) {
    this.layer = new Renderium.CanvasLayer({
      Vector
    })
    this.examples = {}

    this.view = view
    this.api = api

    this.setupView()
    this.updateView({
      layer: this.layer
    })
    this.loadCode()
    this.loadExamples()
  }

  setupView () {
    this.view.on('change:code', this.execCode.bind(this))
    this.view.on('change:code', this.saveCode.bind(this))
    this.view.on('change:example', this.setExample.bind(this))
  }

  updateView (state) {
    this.view.set(state)
  }

  loadCode () {
    this.api.getCode()
      .then((code) => this.setCode(code))
  }

  saveCode (code) {
    this.api.saveCode(code)
  }

  loadExamples () {
    return this.api.getExamples()
      .then(result => Promise.all(result.map(example => this.loadExample(example.name))))
  }

  loadExample (name) {
    return this.api.getExample(name)
      .then(code => this.addExample(name, code))
  }

  addExample (name, code) {
    this.examples[name] = code
    this.updateView({
      examples: Object.keys(this.examples)
    })
  }

  setExample (name) {
    this.updateView({
      activeExample: name
    })
    this.setCode(this.examples[name])
  }

  setCode (code) {
    this.updateView({
      code: code
    })
    this.execCode(code)
  }

  execCode (code) {
    this.code = code
    this.layer.clearComponents()
    try {
      var func = new Function('Renderium', 'Animation', 'Vector', 'layer', code) // eslint-disable-line
      func(Renderium, Animation, Vector, this.layer)
    } catch (e) {
      console.error(e)
    }
  }
}

export default Playground
