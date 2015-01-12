
var React = require('react')

function animate(fn, start, end, step) {
  if (end < start) return
  window.requestAnimationFrame(function () {
    fn(start)
    animate(fn, start + step, end, step)
  })
}

function animateLoop(fn) {
  // if (true === fn()) return
  window.requestAnimationFrame(function () {if (true === fn()) return; animateLoop(fn)})
}

function betterReference(c6, x, y, sides, s, rotation, margin, cx, cy, s2) {
  margin = margin || 50
  c6.clearRect(0, 0, c6.canvas.width, c6.canvas.height)
  c6.drawImage(img, margin, margin)

  c6.lineWidth = 1
  c6.strokeStyle = 'green'
  
  c6.beginPath()
  c6.arc(margin + cx, margin + cy, s2, 0, Math.PI*2)
  c6.stroke()
  
  c6.save()
  c6.translate(margin + x, margin + y)
  c6.rotate(-rotation)
  c6.beginPath()
  var dm = Math.PI/sides
    , dx = Math.cos(dm) * s
    , dy = Math.sin(dm) * s
  c6.moveTo(0, 0)
  c6.lineTo(s, 0)
  c6.lineTo(dx, dy)
  c6.lineTo(0, 0)
  c6.stroke()
  c6.restore()
}

function kollide(c4, sides, s, fn) {
  c4.clearRect(0,0,c4.canvas.width,c4.canvas.height)

  c4.save()

  var dt = Math.PI * 2 / sides
    , dm = Math.PI / sides
    , dx = Math.cos(dm) * s
    , dy = Math.sin(dm) * s
  c4.translate(c4.canvas.width/2, c4.canvas.height/2)
  //c4.rotate(dt/4)
  for (var i=0; i<sides; i++) {
    c4.save()

    c4.beginPath()
    c4.lineTo(s, 0)
    c4.lineTo(dx, dy)
    c4.lineTo(0, 0)
    c4.clip()

    fn(c4)
    c4.restore()
    
    c4.save()
    c4.scale(1,-1)

    c4.beginPath()
    c4.lineTo(s, 0)
    c4.lineTo(dx, dy)
    c4.lineTo(0, 0)
    c4.clip()

    fn(c4)
    c4.restore()


    c4.rotate(dt)
  }

  c4.restore()
}

function kollideMax(c4, sides, s, fn) {
  c4.clearRect(0,0,c4.canvas.width,c4.canvas.height)

  c4.save()

  var dt = Math.PI * 2 / sides
    , dm = Math.PI / sides
    , dx = Math.cos(dm) * s
    , dy = Math.sin(dm) * s
  c4.translate(c4.canvas.width / 2, c4.canvas.height / 2)
  //c4.rotate(dt/4)
  for (var i=0; i<sides; i++) {

    // normal
    c4.save()

    c4.beginPath()
    c4.lineTo(s, 0)
    c4.lineTo(dx, dy)
    c4.lineTo(0, 0)
    c4.clip()

    fn(c4)
    c4.restore()

    // flipped
    c4.save()
    c4.scale(1,-1)

    c4.beginPath()
    c4.lineTo(s, 0)
    c4.lineTo(dx, dy)
    c4.lineTo(0, 0)
    c4.clip()

    fn(c4)
    c4.restore()

    // flipped2
    c4.save()
    c4.rotate(Math.PI - dm)
    c4.translate(-s-dx, -dy)

    c4.beginPath()
    c4.lineTo(s, 0)
    c4.lineTo(dx, dy)
    c4.lineTo(0, 0)
    c4.clip()

    fn(c4)
    c4.restore()

    // flipped3
    c4.save()
    c4.scale(-1,1)
    c4.rotate(- dm)
    c4.translate(-s-dx, -dy)

    c4.beginPath()
    c4.lineTo(s, 0)
    c4.lineTo(dx, dy)
    c4.lineTo(0, 0)
    c4.clip()

    fn(c4)
    c4.restore()
  
    c4.rotate(dt)
  }

  c4.restore()
}

function bounce(x, y, dx, dy, w, h, mx, my, margin) {
  x += dx * mx
  y += dy * my
  if (x > w - margin) {
    dx *= -1
    x = w - margin
  }
  if (x < margin) {
    dx *= -1
    x = margin
  }
  if (y > h - margin) {
    dy *= -1
    y = h - margin
  }
  if (y < margin) {
    dy *= -1
    y = margin
  }
  return {x: x, y: y, dx: dx, dy: dy}
}

function kollBounce(ani, ref, img, sides, size, irot, byrot, size2, byrot2, mx, my, imarg, state) {
  var margin = 50
    , s = size
    , x = imarg
    , y = imarg
    , rot = irot
    , done = false
    , w = img.width
    , h = img.height

  if (isNaN(byrot)) byrot = 0
  state = state || {
    x: x,
    y: y,
    dx: 1,
    dy: 1,
    rot: rot,
    rot2: 0,
  }
  
  if (ani.canvas.width !== size * 2) ani.canvas.width = size * 2
  if (ani.canvas.height !== size * 2) ani.canvas.height = size * 2
  if (ref.canvas.width !== img.width + margin*2) ref.canvas.width = img.width + margin*2
  if (ref.canvas.height !== img.height + margin*2) ref.canvas.height = img.height + margin*2
  
  state.stop = ani.canvas.onclick = function(){done=true}
  
  setTimeout(function() {
  animateLoop(function () {
    if (done) return true
    if (!ani.canvas.getBoundingClientRect().height) {
      // no longer visible
      return true
    }
    
    state.rot += byrot
    state.rot2 += byrot2
    
    var pos = bounce(state.x, state.y, state.dx, state.dy, w, h, mx, my, imarg)
    state.x = pos.x
    state.y = pos.y
    state.dx = pos.dx
    state.dy = pos.dy
    
    
    var ax = state.x + Math.cos(state.rot2) * size2
      , ay = state.y + Math.sin(state.rot2) * size2
    
    kollide(ani, sides, s, function (c) {
      c.rotate(state.rot)
      c.drawImage(img, -ax, -ay)
    })
    betterReference(ref, ax, ay, sides, s, state.rot, margin, state.x, state.y, size2)
  }, -100, 210, 1)
  }, 0)
  return state
}


var Chooser = React.createClass({
  render: function () {
    var current = this.props.value
    return <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
      {this.props.options.map(option => <li 
        onClick={option !== current && this.props.onSelect.bind(null, option)}
        className={'choice' + (option === current ? ' choice-selected' : '')}>{(option === current ? '>' : '') + option}</li>)}
    </ul>
  }
})


var Counter = React.createClass({
  render: function () {
    return <Number onChange={this.props.onChange}
      value={this.props.value}
      validator={parseInt}
      min={this.props.min}
      max={this.props.max}
      minor={this.props.by || 1} major={(this.props.by || 1) * 10}/>
  }
})


var Floater = React.createClass({
  getDefaultProps: function () {
    return {by: .01, places: 2}
  },
  onChange: function (value) {
    if ('number' !== typeof value) return this.props.onChange(value)
    var mul = Math.pow(10, this.props.places)
    this.props.onChange(Math.round(value * mul) / mul)
  },
  render: function () {
    return <Number onChange={this.onChange}
      value={this.props.value}
      validator={parseFloat}
      min={this.props.min}
      max={this.props.max}
      minor={this.props.by}
      major={this.props.by*10}/>
  }
})


var Number = React.createClass({
  getDefaultProps: function () {
    return {
      min: false,
      max: false,
      minor: 1,
      major: 10,
    }
  },
  getInitialState: function () {
    return {
      dragging: false,
      ival: null,
      dpos: 0,
    }
  },
  onChange: function (e) {
    var val = e.target.value.trim()
    if (val && val !== '-' && val[val.length-1] !== '.' && val[val.length-1] !== '0') {
      val = this.props.validator(val)
      if (isNaN(val)) val = 0
      if (this.props.min !== false && val < this.props.min) {
        val = this.props.min
      }
      if (this.props.max !== false && val > this.props.max) {
        val = this.props.max
      }
    }
    this.props.onChange(val)
  },
  _startDrag: function (e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({dragging: true, ival: this.props.value, dpos: 0})
  },
  _onDrag: function (e) {
    var x = e.clientX
      , scale = this.props.minor / 10
      , x0 = this.refs.input.getDOMNode().getBoundingClientRect().right
      , val = this.state.ival + (x - x0) * scale
      , dpos = x - x0
    val = this.props.validator(val)
    if (this.props.min !== false && val < this.props.min) {
      dpos = (this.props.min - this.state.ival) / scale
      val = this.props.min
    }
    if (this.props.max !== false && val > this.props.max) {
      dpos = (this.props.max - this.state.ival) / scale
      val = this.props.max
    }
    this.props.onChange(val)
    this.setState({dpos: dpos})
  },
  _endDrag: function () {
    this.setState({dragging: false, ival: null, dpos: 0})
  },
  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.dragging && !this.state.dragging) {
      this.getDOMNode().ownerDocument.removeEventListener('mousemove', this._onDrag)
      this.getDOMNode().ownerDocument.removeEventListener('mouseup', this._endDrag)
    } else if (this.state.dragging && !prevState.dragging) {
      this.getDOMNode().ownerDocument.addEventListener('mousemove', this._onDrag)
      this.getDOMNode().ownerDocument.addEventListener('mouseup', this._endDrag)
    }
  },
  onKeyDown: function (e) {
    var val = this.props.value
    if (e.key === 'ArrowUp') {
      val += (e.shiftKey ? this.props.major : this.props.minor)
    } else if (e.key === 'ArrowDown') {
      val -= (e.shiftKey ? this.props.major : this.props.minor)
    } else {return}
    if (isNaN(val)) val = 0
    if (this.props.min !== false && val < this.props.min) {
      val = this.props.min
    }
    if (this.props.max !== false && val > this.props.max) {
      val = this.props.max
    }
    this.props.onChange(val)
  },
  render: function () {
    return <div style={{
        position: 'relative',
        backgroundColor: 'red',
        display: 'inline-block',
      }}>
      <input ref="input" value={this.props.value} onChange={this.onChange} onKeyDown={this.onKeyDown} style={{width: 50}}/>
      <div style={{
        position: 'absolute',
        top: '50%',
        right: -this.state.dpos,
        width: 20,
        marginTop: -10,
        marginRight: -10,
        height: 20,
        backgroundColor: '#ccf',
        cursor: 'pointer',
        zIndex: 1000,
        opacity: .7,
        borderRadius: 10
      }} onMouseDown={this._startDrag}/>
    </div>
  }
})

var KollUI = React.createClass({
  getInitialState: function () {
    return {
      mode: 'bounce', // mouse, mouseDouble
      sides: 6, // 2 - 10
      size: 150,
      size2: 0,
      mx: 1,
      my: 1,
      margin: 20,
      rot: .01,
      rot2: .02,
    }
  },
  _renderControls: function () {
    return <div style={{float: 'left'}}>
      {/*Mode: <Chooser value={this.state.mode}
        options={['bounce', 'mouse', 'mouse2']}
        onSelect={value => this.setState({mode: value})}/>
      <br/>*/}
      <h3>Wedge</h3>
      <div>
      Sides: <Counter value={this.state.sides} 
                max={20} min={2}
                onChange={value => this.setState({sides: value})}/>
      </div>
      <div>
        Length: <Counter value={this.state.size} 
              max={200} min={30}
              onChange={value => this.setState({size: value})}/>
      </div>
      <div>
      Rotation Speed: <Floater value={this.state.rot} max={Math.PI/3} min={-Math.PI/3}
        by={.001} places={3}
        onChange={value => this.setState({rot: value})}/>
      </div>

      <h3>Bounce</h3>
      <div>
      Horizontal Speed: <Floater value={this.state.mx} max={10} min={0}
        by={.1} places={3}
        onChange={value => this.setState({mx: value})}/>
      </div>
      <div>
      Vertical Speed: <Floater value={this.state.my} max={10} min={0}
        by={.1} places={3}
        onChange={value => this.setState({my: value})}/>
      </div>
      <div>
      Bounce Margin: <Counter value={this.state.margin} max={100} min={0}
        by={5}
        onChange={value => this.setState({margin: value})}/>
      </div>

      <h3>Revolution</h3>
      <div>
        Revolution Size: <Counter value={this.state.size2}
          max={200} min={0} by={5}
          onChange={value => this.setState({size2: value})}/>
      </div>
      <div>
        Revolution Speed: <Floater value={this.state.rot2}
          max={Math.PI/3} min={-Math.PI/3} by={.001} places={4}
          onChange={value => this.setState({rot2: value})}/>
      </div>
    </div>
  },
  _koll: function () {
    if (isNaN(this.state.sides)) return
    if (this.state.mode === 'bounce') {
      if (this._state) this._state.stop()
      this._state = kollBounce(
        this.refs.ani.getDOMNode().getContext('2d'),
        this.refs.ref.getDOMNode().getContext('2d'),
        img,
        this.state.sides,
        this.state.size,
        0, parseFloat(this.state.rot),
        this.state.size2,
        parseFloat(this.state.rot2),
        parseFloat(this.state.mx),
        parseFloat(this.state.my),
        this.state.margin,
        this._state)
    } else {
      if (this._state) this._state.stop()
    
    }

  },
  componentDidMount: function () {
    this._koll()
  },
  componentDidUpdate: function () {
    this._koll()
  },
  render: function () {
    return <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#777',
      }}>
      <canvas ref="ani"/>
      <canvas ref="ref"/>
      {this._renderControls()}
    </div>
  }
})

var img = document.createElement('img')
img.src = 'mona-lisa.jpg'
img.onload = function () {
React.render(React.createElement(KollUI), document.body)
}
