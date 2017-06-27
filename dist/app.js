(function (lib) {
'use strict';

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

// TODO this is out of date
function destroyEach(iterations, detach, start) {
	for (var i = start; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].destroy(detach);
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs(newValue, oldValue)) {
			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	this._root._flush();
}

function _flush() {
	if (!this._renderHooks) return;

	while (this._renderHooks.length) {
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
	style.id = "svelte-3590224031-style";
	style.textContent = "\r\n  [svelte-3590224031].container, [svelte-3590224031] .container {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    height: 60px;\r\n    padding-left: 20px;\r\n    padding-right:  20px;\r\n    background: #212121;\r\n  }\r\n\r\n  [svelte-3590224031].text, [svelte-3590224031] .text {\r\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n    font-size: 24px;\r\n    margin: 0;\r\n    color: white;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment$1 ( state, component ) {
	var header, h1, text, text_1;

	return {
		create: function () {
			header = createElement( 'header' );
			h1 = createElement( 'h1' );
			text = createText( "Renderium REPL" );
			text_1 = createText( "\r\n  " );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( header, 'svelte-3590224031', '' );
			header.className = "container";
			h1.className = "text";
		},

		mount: function ( target, anchor ) {
			insertNode( header, target, anchor );
			appendNode( h1, header );
			appendNode( text, h1 );
			appendNode( text_1, header );
			if ( component._yield ) component._yield.mount( header, null );
		},

		unmount: function () {
			detachNode( header );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
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
	if ( !document.getElementById( "svelte-3590224031-style" ) ) add_css$1();

	this._fragment = create_main_fragment$1( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
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

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$1 = (function () {
  const settings = {
    mode: 'javascript',
    tabSize: 2,
    lineNumbers: true
  };

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
	style.id = "svelte-84478798-style";
	style.textContent = "\r\n  [svelte-84478798].editor, [svelte-84478798] .editor {\r\n    width: 50%;\r\n    height: 100%;\r\n    box-sizing: border-box;\r\n    border-right: 5px solid #e2e2e2;\r\n  }\r\n\r\n  [svelte-84478798].CodeMirror, [svelte-84478798] .CodeMirror {\r\n    height: 100%;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment$2 ( state, component ) {
	var div;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-84478798', '' );
			div.className = "editor";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component.refs.editor = div;
		},

		unmount: function () {
			detachNode( div );
			if ( component.refs.editor === div ) component.refs.editor = null;
		},

		destroy: noop
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
	if ( !document.getElementById( "svelte-84478798-style" ) ) add_css$2();

	this._fragment = create_main_fragment$2( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

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

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
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
	var div, div_1;

	return {
		create: function () {
			div = createElement( 'div' );
			div_1 = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-3219609244', '' );
			div.className = "preview";
			div_1.className = "renderer";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
			component.refs.preview = div_1;
		},

		unmount: function () {
			detachNode( div );
			if ( component.refs.preview === div_1 ) component.refs.preview = null;
		},

		destroy: noop
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

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

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

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$3 = (function () {
  return {
    methods: {
      triggerChange (e) {
        this.fire('change', {
          example: e.target.value
        });
      }
    }
  }
}());

function add_css$4 () {
	var style = createElement( 'style' );
	style.id = "svelte-1183016256-style";
	style.textContent = "\r\n  [svelte-1183016256].select, [svelte-1183016256] .select {\r\n    width: 200px;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment$4 ( state, component ) {
	var select, option, text;

	var each_block_value = state.examples;

	var each_block_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
	}

	function change_handler ( event ) {
		component.triggerChange(event);
	}

	return {
		create: function () {
			select = createElement( 'select' );
			option = createElement( 'option' );
			text = createText( "Examples" );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].create();
			}
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( select, 'svelte-1183016256', '' );
			option.disabled = true;
			select.className = "select";
			addListener( select, 'change', change_handler );
		},

		mount: function ( target, anchor ) {
			insertNode( select, target, anchor );
			appendNode( option, select );
			appendNode( text, option );

			option.__value = option.textContent;

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].mount( select, null );
			}
		},

		update: function ( changed, state ) {
			option.__value = option.textContent;

			var each_block_value = state.examples;

			if ( 'examples' in changed || 'active' in changed ) {
				for ( var i = 0; i < each_block_value.length; i += 1 ) {
					if ( each_block_iterations[i] ) {
						each_block_iterations[i].update( changed, state, each_block_value, each_block_value[i], i );
					} else {
						each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
						each_block_iterations[i].create();
						each_block_iterations[i].mount( select, null );
					}
				}

				for ( ; i < each_block_iterations.length; i += 1 ) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}
		},

		unmount: function () {
			detachNode( select );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].unmount();
			}
		},

		destroy: function () {
			destroyEach( each_block_iterations, false, 0 );

			removeListener( select, 'change', change_handler );
		}
	};
}

function create_each_block ( state, each_block_value, example, example_index, component ) {
	var if_block_anchor;

	function get_block ( state, each_block_value, example, example_index ) {
		if ( example === state.active ) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block( state, each_block_value, example, example_index );
	var if_block = current_block( state, each_block_value, example, example_index, component );

	return {
		create: function () {
			if_block.create();
			if_block_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			if_block.mount( target, anchor );
			insertNode( if_block_anchor, target, anchor );
		},

		update: function ( changed, state, each_block_value, example, example_index ) {
			if ( current_block === ( current_block = get_block( state, each_block_value, example, example_index ) ) && if_block ) {
				if_block.update( changed, state, each_block_value, example, example_index );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block( state, each_block_value, example, example_index, component );
				if_block.create();
				if_block.mount( if_block_anchor.parentNode, if_block_anchor );
			}
		},

		unmount: function () {
			if_block.unmount();
			detachNode( if_block_anchor );
		},

		destroy: function () {
			if_block.destroy();
		}
	};
}

function create_if_block ( state, each_block_value, example, example_index, component ) {
	var option, option_value_value, text_value, text;

	return {
		create: function () {
			option = createElement( 'option' );
			text = createText( text_value = example );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			option.__value = option_value_value = example;
			option.value = option.__value;
			option.selected = true;
		},

		mount: function ( target, anchor ) {
			insertNode( option, target, anchor );
			appendNode( text, option );
		},

		update: function ( changed, state, each_block_value, example, example_index ) {
			if ( option_value_value !== ( option_value_value = example ) ) {
				option.__value = option_value_value;
			}

			option.value = option.__value;

			if ( text_value !== ( text_value = example ) ) {
				text.data = text_value;
			}
		},

		unmount: function () {
			detachNode( option );
		},

		destroy: noop
	};
}

function create_if_block_1 ( state, each_block_value, example, example_index, component ) {
	var option, option_value_value, text_value, text;

	return {
		create: function () {
			option = createElement( 'option' );
			text = createText( text_value = example );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			option.__value = option_value_value = example;
			option.value = option.__value;
		},

		mount: function ( target, anchor ) {
			insertNode( option, target, anchor );
			appendNode( text, option );
		},

		update: function ( changed, state, each_block_value, example, example_index ) {
			if ( option_value_value !== ( option_value_value = example ) ) {
				option.__value = option_value_value;
			}

			option.value = option.__value;

			if ( text_value !== ( text_value = example ) ) {
				text.data = text_value;
			}
		},

		unmount: function () {
			detachNode( option );
		},

		destroy: noop
	};
}

function Examples ( options ) {
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
	if ( !document.getElementById( "svelte-1183016256-style" ) ) add_css$4();

	this._fragment = create_main_fragment$4( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Examples.prototype, template$3.methods, proto );

Examples.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Examples.prototype.teardown = Examples.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template = (function () {
  return {
    data () {
      return {
        code: '',
        examples: [],
        activeExample: ''
      }
    },

    methods: {
      triggerChangeCode (code) {
        this.fire('change:code', code);
      },

      triggerChangeExample (example) {
        this.fire('change:example', example);
      }
    }
  }
}());

function add_css () {
	var style = createElement( 'style' );
	style.id = "svelte-3709038308-style";
	style.textContent = "\r\n  [svelte-3709038308].app, [svelte-3709038308] .app {\r\n    height: calc(100% - 60px);\r\n  }\r\n\r\n  [svelte-3709038308].main, [svelte-3709038308] .main {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 100%;\r\n  }\r\n";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div, text, section, text_1;

	var header_1_yield_fragment = create_header_yield_fragment( state, component );

	var header_1 = new Header({
		_root: component._root,
		_yield: header_1_yield_fragment
	});

	var editor = new Editor({
		_root: component._root,
		data: { code: state.code }
	});

	editor.on( 'change', function ( event ) {
		component.triggerChangeCode(event.code);
	});

	var preview = new Preview({
		_root: component._root,
		data: { layer: state.layer }
	});

	return {
		create: function () {
			div = createElement( 'div' );
			header_1_yield_fragment.create();
			header_1._fragment.create();
			text = createText( "\r\n  " );
			section = createElement( 'section' );
			editor._fragment.create();
			text_1 = createText( "\r\n    " );
			preview._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-3709038308', '' );
			div.className = "app";
			section.className = "main";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			header_1._fragment.mount( div, null );
			appendNode( text, div );
			appendNode( section, div );
			editor._fragment.mount( section, null );
			appendNode( text_1, section );
			preview._fragment.mount( section, null );
		},

		update: function ( changed, state ) {
			header_1_yield_fragment.update( changed, state );

			var editor_changes = {};

			if ( 'code' in changed ) editor_changes.code = state.code;

			if ( Object.keys( editor_changes ).length ) editor.set( editor_changes );

			var preview_changes = {};

			if ( 'layer' in changed ) preview_changes.layer = state.layer;

			if ( Object.keys( preview_changes ).length ) preview.set( preview_changes );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			header_1_yield_fragment.destroy();
			header_1.destroy( false );
			editor.destroy( false );
			preview.destroy( false );
		}
	};
}

function create_header_yield_fragment ( state, component ) {

	var examples_1_yield_fragment = create_examples_yield_fragment( state, component );

	var examples_1 = new Examples({
		_root: component._root,
		_yield: examples_1_yield_fragment,
		data: { examples: state.examples, active: state.activeExample }
	});

	examples_1.on( 'change', function ( event ) {
		component.triggerChangeExample(event.example);
	});

	return {
		create: function () {
			examples_1_yield_fragment.create();
			examples_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			examples_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			var examples_1_changes = {};

			if ( 'examples' in changed ) examples_1_changes.examples = state.examples;
			if ( 'activeExample' in changed ) examples_1_changes.active = state.activeExample;

			if ( Object.keys( examples_1_changes ).length ) examples_1.set( examples_1_changes );
		},

		unmount: function () {
			examples_1._fragment.unmount();
		},

		destroy: function () {
			examples_1_yield_fragment.destroy();
			examples_1.destroy( false );
		}
	};
}

function create_examples_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "\r\n  " );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
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
	if ( !document.getElementById( "svelte-3709038308-style" ) ) add_css();
	this._renderHooks = [];

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
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

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
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

class Repl {
  constructor ({ view, api }) {
    this.layer = new lib.Renderium.CanvasLayer({
      Vector: lib.Vector
    });
    this.examples = {};

    this.view = view;
    this.api = api;

    this.setupView();
    this.updateView({
      layer: this.layer
    });
    this.loadCode();
    this.loadExamples();
  }

  setupView () {
    this.view.on('change:code', this.execCode.bind(this));
    this.view.on('change:code', this.saveCode.bind(this));
    this.view.on('change:example', this.setExample.bind(this));
  }

  updateView (state) {
    this.view.set(state);
  }

  loadCode () {
    this.api.getCode()
      .then((code) => this.setCode(code));
  }

  saveCode (code) {
    this.api.saveCode(code);
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
    this.examples[name] = code;
    this.updateView({
      examples: Object.keys(this.examples)
    });
  }

  setExample (name) {
    this.updateView({
      activeExample: name
    });
    this.setCode(this.examples[name]);
  }

  setCode (code) {
    this.updateView({
      code: code
    });
    this.execCode(code);
  }

  execCode (code) {
    this.code = code;
    this.layer.clearComponents();
    try {
      var func = new Function('Renderium', 'Animation', 'Vector', 'layer', code); // eslint-disable-line
      func(lib.Renderium, lib.Animation, lib.Vector, this.layer);
    } catch (e) {
      console.error(e);
    }
  }
}

/*
global XMLHttpRequest, localStorage, atob
*/

const API_URL = 'https://api.github.com/';
const EXAMPLES_URL = 'repos/renderium/examples/contents/repl';
const BRANCH = '?ref=playground';
const STORAGE_KEY = 'renderium-playground';

function fetch (url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onerror = reject;
    xhr.onload = () => resolve(xhr.responseText);
    xhr.send();
  })
}

class Api {
  saveCode (code) {
    return new Promise((resolve, reject) => {
      resolve(localStorage.setItem(`${STORAGE_KEY}-code`, code));
    })
  }

  getCode () {
    return new Promise((resolve, reject) => {
      resolve(localStorage.getItem(`${STORAGE_KEY}-code`) || '');
    })
  }

  getExamples () {
    return fetch(`${API_URL}${EXAMPLES_URL}${BRANCH}`)
      .then(response => JSON.parse(response))
  }

  getExample (name) {
    return fetch(`${API_URL}${EXAMPLES_URL}/${name}${BRANCH}`)
      .then(response => JSON.parse(response))
      .then(result => atob(result.content))
  }
}

var view = new App({
  target: document.body
});

var api = new Api();

window.repl = new Repl({
  view,
  api
});

lib.perfMonitor.startFPSMonitor();
lib.perfMonitor.startMemMonitor();
lib.perfMonitor.initProfiler('digest');

}(Lib));
