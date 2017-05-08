import Renderium from 'renderium'
import Vector from 'vectory'
import Animation from 'dynamica'

const raf = window.requestAnimationFrame

function digest (time) {
  Animation.animate(time)
  Renderium.digest(time)
  raf(digest)
}

class Playground {
  constructor ({ view, code }) {
    this.layer = new Renderium.CanvasLayer({
      Vector
    })
    this.view = view

    raf(digest)

    this.setupView()
    this.updateView({
      code: code,
      layer: this.layer
    })
    this.setCode(code)
  }

  setupView () {
    this.view.on('change:code', this.setCode.bind(this))
  }

  updateView (state) {
    this.view.set(state)
  }

  setCode (code) {
    this.code = code
    this.execCode(code)
  }

  execCode (code) {
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
