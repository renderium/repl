(function (lib) {
'use strict';

function assign ( target ) {
	for ( var i = 1; i < arguments.length; i += 1 ) {
		var source = arguments[i];
		for ( var k in source ) target[k] = source[k];
	}

	return target;
}

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function createElement ( name ) {
	return document.createElement( name );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function setAttribute ( node, attribute, value ) {
	node.setAttribute( attribute, value );
}

var transitionManager = {
	running: false,
	transitions: [],

	add: function ( transition ) {
		transitionManager.transitions.push( transition );

		if ( !this.running ) {
			this.running = true;
			this.next();
		}
	},

	next: function () {
		transitionManager.running = false;

		var now = window.performance.now();
		var i = transitionManager.transitions.length;

		while ( i-- ) {
			var transition = transitionManager.transitions[i];

			if ( transition.program && now >= transition.program.end ) {
				transition.done();
			}

			if ( transition.pending && now >= transition.pending.start ) {
				transition.start( transition.pending );
			}

			if ( transition.running ) {
				transition.update( now );
				transitionManager.running = true;
			} else if ( !transition.pending ) {
				transitionManager.transitions.splice( i, 1 );
			}
		}

		if ( transitionManager.running ) {
			requestAnimationFrame( transitionManager.next );
		}
	}
};

function differs ( a, b ) {
	return ( a !== b ) || ( a && ( typeof a === 'object' ) || ( typeof a === 'function' ) );
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( differs( newValue, oldValue ) ) {
			var callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.post : this._observers.pre;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on ( eventName, handler ) {
	if ( eventName === 'teardown' ) return this.on( 'destroy', handler );

	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function set ( newState ) {
	this._set( assign( {}, newState ) );
	this._root._flush();
}

function _flush () {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		this._renderHooks.pop()();
	}
}

var proto = {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	_flush: _flush
};

function add_css$1 () {
	var style = createElement( 'style' );
	style.id = "svelte-1863729431-style";
	style.textContent = "\r\n  [svelte-1863729431].container, [svelte-1863729431] .container {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    height: 60px;\r\n    background: #212121;\r\n  }\r\n\r\n  [svelte-1863729431].text, [svelte-1863729431] .text {\r\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n    font-size: 24px;\r\n    margin: 0;\r\n    padding-left: 20px;\r\n    color: white;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment$1 ( state, component ) {
	var header = createElement( 'header' );
	setAttribute( header, 'svelte-1863729431', '' );
	header.className = "container";
	var h1 = createElement( 'h1' );
	appendNode( h1, header );
	h1.className = "text";
	appendNode( createText( "Renderium Playground" ), h1 );

	return {
		mount: function ( target, anchor ) {
			insertNode( header, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( header );
			}
		}
	};
}

function Header ( options ) {
	options = options || {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( "svelte-1863729431-style" ) ) add_css$1();

	this._fragment = create_main_fragment$1( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Header.prototype, proto );

Header.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Header.prototype.teardown = Header.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var settings = {
  mode: 'javascript',
  tabSize: 2,
  lineNumbers: true
};

var template$1 = (function () {
  return {
    oncreate () {
      this.editor = lib.CodeMirror(this.refs.editor, settings);

      this.observe('code', this.setCode.bind(this));
      this.editor.on('change', this.triggerChange.bind(this));
    },

    methods: {
      setCode (code) {
        this.editor.setValue(code);
      },

      triggerChange () {
        this.fire('change', {
          code: this.editor.getValue()
        });
      }
    }
  }

}());

function add_css$2 () {
	var style = createElement( 'style' );
	style.id = "svelte-3867611727-style";
	style.textContent = "\r\n  [svelte-3867611727].editor, [svelte-3867611727] .editor {\r\n    width: 50%;\r\n    height: 100%;\r\n    box-sizing: border-box;\r\n    border-right: 5px solid #e2e2e2;\r\n  }\r\n\r\n  [svelte-3867611727].CodeMirror, [svelte-3867611727] .CodeMirror {\r\n    height: 100%;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment$2 ( state, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-3867611727', '' );
	div.className = "editor";
	component.refs.editor = div;

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			if ( component.refs.editor === div ) component.refs.editor = null;

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Editor ( options ) {
	options = options || {};
	this.refs = {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( "svelte-3867611727-style" ) ) add_css$2();

	this._fragment = create_main_fragment$2( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );

	if ( options._root ) {
		options._root._renderHooks.push( template$1.oncreate.bind( this ) );
	} else {
		template$1.oncreate.call( this );
	}
}

assign( Editor.prototype, template$1.methods, proto );

Editor.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Editor.prototype.teardown = Editor.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$2 = (function () {
  return {
    oncreate () {
      this.renderer = new lib.Renderium({
        el: this.refs.preview
      });
      lib.Renderium.spawn(this.renderer);

      this.observe('layer', this.setLayer.bind(this));
    },

    methods: {
      setLayer (layer) {
        this.renderer.removeLayer(this.layer);
        this.layer = layer;
        if (this.layer) {
          this.renderer.addLayer(this.layer);
        }
      }
    }
  }
}());

function add_css$3 () {
	var style = createElement( 'style' );
	style.id = "svelte-3219609244-style";
	style.textContent = "\r\n  [svelte-3219609244].preview, [svelte-3219609244] .preview {\r\n    width: 50%;\r\n    height: 100%;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment$3 ( state, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-3219609244', '' );
	div.className = "preview";
	var div_1 = createElement( 'div' );
	appendNode( div_1, div );
	div_1.className = "renderer";
	component.refs.preview = div_1;

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			if ( component.refs.preview === div_1 ) component.refs.preview = null;

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Preview ( options ) {
	options = options || {};
	this.refs = {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( "svelte-3219609244-style" ) ) add_css$3();

	this._fragment = create_main_fragment$3( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );

	if ( options._root ) {
		options._root._renderHooks.push( template$2.oncreate.bind( this ) );
	} else {
		template$2.oncreate.call( this );
	}
}

assign( Preview.prototype, template$2.methods, proto );

Preview.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Preview.prototype.teardown = Preview.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template = (function () {
  return {
    data() {
      return {
        code: ''
      }
    },

    methods: {
      triggerChangeCode(code) {
        this.fire('change:code', code);
      }
    }
  }
}());

function add_css () {
	var style = createElement( 'style' );
	style.id = "svelte-3921273334-style";
	style.textContent = "\r\n  [svelte-3921273334].app, [svelte-3921273334] .app {\r\n    height: calc(100% - 60px);\r\n  }\r\n\r\n  [svelte-3921273334].main, [svelte-3921273334] .main {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 100%;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-3921273334', '' );
	div.className = "app";

	var header = new Header({
		target: div,
		_root: component._root
	});

	appendNode( createText( "\r\n  " ), div );
	var section = createElement( 'section' );
	appendNode( section, div );
	section.className = "main";

	var editor = new Editor({
		target: section,
		_root: component._root,
		data: { code: state.code }
	});

	editor.on( 'change', function ( event ) {
		component.triggerChangeCode(event.code);
	});

	appendNode( createText( "\r\n    " ), section );

	var preview = new Preview({
		target: section,
		_root: component._root,
		data: { layer: state.layer }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		update: function ( changed, state ) {
			var editor_changes = {};

			if ( 'code' in changed ) editor_changes.code = state.code;

			if ( Object.keys( editor_changes ).length ) editor.set( editor_changes );

			var preview_changes = {};

			if ( 'layer' in changed ) preview_changes.layer = state.layer;

			if ( Object.keys( preview_changes ).length ) preview.set( preview_changes );
		},

		destroy: function ( detach ) {
			header.destroy( false );
			editor.destroy( false );
			preview.destroy( false );

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function App ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( "svelte-3921273334-style" ) ) add_css();
	this._renderHooks = [];

	this._fragment = create_main_fragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
	this._flush();
}

assign( App.prototype, template.methods, proto );

App.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
	this._flush();
};

App.prototype.teardown = App.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

const raf = window.requestAnimationFrame;

raf(function digest (time) {
  lib.perfMonitor.startProfile('digest');
  lib.Animation.animate(time);
  lib.Renderium.digest(time);
  lib.perfMonitor.endProfile('digest');
  raf(digest);
});

class Playground {
  constructor ({ view, code }) {
    this.layer = new lib.Renderium.CanvasLayer({
      Vector: lib.Vector
    });
    this.view = view;

    this.setupView();
    this.updateView({
      code: code,
      layer: this.layer
    });
    this.setCode(code);
  }

  setupView () {
    this.view.on('change:code', this.setCode.bind(this));
  }

  updateView (state) {
    this.view.set(state);
  }

  setCode (code) {
    this.code = code;
    this.execCode(code);
  }

  execCode (code) {
    this.layer.clearComponents();
    try {
      var func = new Function('Renderium', 'Animation', 'Vector', 'layer', code); // eslint-disable-line
      func(lib.Renderium, lib.Animation, lib.Vector, this.layer);
    } catch (e) {
      console.error(e);
    }
  }
}

var code = `function Arc (options) {
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
`;

var view = new App({
  target: document.body
});

window.playground = new Playground({
  view,
  code
});

lib.perfMonitor.startFPSMonitor();
lib.perfMonitor.startMemMonitor();
lib.perfMonitor.initProfiler('digest');

}(Lib));
