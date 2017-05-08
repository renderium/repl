export default `function Arc (options) {
  this.position = options.position
  this.color = options.color
  this.radius = options.radius
  this.startAngle = options.startAngle
  this.endAngle = options.endAngle
  this.width = options.width
  this.duration = options.duration

  this._startAngle = this.startAngle
  this._endAngle = this.endAngle

  this.animation = new Animation({
    duration: this.duration,
    handler: this._hanlder.bind(this)
  })
  this.animation.queue(this.animation)

  this._shouldRedraw = true
}

Arc.prototype.shouldRedraw = function () {
  return true
}

Arc.prototype.onadd = function (layer) {
  this.animation.start()
}

Arc.prototype.onremove = function (layer) {
  this.animation.cancel()
}

Arc.prototype.plot = function (layer, time) {}

Arc.prototype.draw = function (layer) {
  layer.drawArc({
    position: this.position,
    color: this.color,
    radius: this.radius,
    startAngle: this._startAngle,
    endAngle: this._endAngle,
    width: this.width
  })

  this._shouldRedraw = false
}

Arc.prototype._hanlder = function (t) {
  var theta = t * (Math.PI * 2)
  this._startAngle = this.startAngle + theta
  this._endAngle = this.endAngle + theta
  this._shouldRedraw = true
}

layer.addComponents([
  new Arc({
    position: new Vector(100, 100),
    color: Renderium.colors.RED,
    radius: 25,
    startAngle: 0,
    endAngle: 1.5 * Math.PI,
    width: 1,
    duration: 1000
  }),
  new Arc({
    position: new Vector(200, 100),
    color: layer.createGradient({
      start: new Vector(0, 75),
      end: new Vector(0, 125),
      from: Renderium.colors.LIGHT_BLUE,
      to: Renderium.colors.INDIGO
    }),
    radius: 25,
    startAngle: 0,
    endAngle: 1.5 * Math.PI,
    width: 10,
    duration: 1000
  }),
  new Arc({
    position: new Vector(300, 100),
    color: Renderium.colors.GREEN,
    radius: 25,
    startAngle: Math.PI,
    endAngle: 0.5 * Math.PI,
    width: 5,
    duration: 1000
  }),
  new Arc({
    position: new Vector(425, 100),
    color: Renderium.colors.YELLOW,
    radius: 50,
    startAngle: Math.PI,
    endAngle: 0.5 * Math.PI,
    width: 2,
    duration: 1000
  })
])
`
