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

function reinsertBetween(before, after, target) {
	while (before.nextSibling && before.nextSibling !== after) {
		target.appendChild(before.parentNode.removeChild(before.nextSibling));
	}
}

// TODO this is out of date
function destroyEach(iterations, detach, start) {
	for (var i = start; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].destroy(detach);
	}
}

function createFragment() {
	return document.createDocumentFragment();
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

function destroy(detach) {
	this.destroy = this.set = this.get = noop;
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = this._state = null;
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

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
	if (this._root._lock) return;
	this._root._lock = true;
	callAll(this._root._beforecreate);
	callAll(this._root._oncreate);
	callAll(this._root._aftercreate);
	this._root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign({}, oldState, newState);
	this._recompute(changed, this._state, oldState, false);
	if (this._bind) this._bind(changed, this._state);
	dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
	this._fragment.update(changed, this._state);
	dispatchObservers(this, this._observers.post, changed, this._state, oldState);
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

var proto = {
	destroy: destroy,
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	teardown: destroy,
	_recompute: noop,
	_set: _set
};

function encapsulateStyles$1 ( node ) {
	setAttribute( node, 'svelte-1314837231', '' );
}

function add_css$1 () {
	var style = createElement( 'style' );
	style.id = 'svelte-1314837231-style';
	style.textContent = "[svelte-1314837231].container,[svelte-1314837231] .container{display:flex;flex-direction:row;justify-content:space-between;align-items:center;height:60px;padding-left:20px;padding-right:20px;background:#212121}[svelte-1314837231].text,[svelte-1314837231] .text{font-family:\"Helvetica Neue\", Helvetica, Arial, sans-serif;font-size:24px;margin:0;color:white}";
	appendNode( style, document.head );
}

function create_main_fragment$1 ( state, component ) {
	var header, h1, text, text_1, slot_content_default = component._slotted.default, slot_content_default_before, slot_content_default_after;

	return {
		create: function () {
			header = createElement( 'header' );
			h1 = createElement( 'h1' );
			text = createText( "Renderium REPL" );
			text_1 = createText( "\r\n  " );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles$1( header );
			header.className = "container";
			h1.className = "text";
		},

		mount: function ( target, anchor ) {
			insertNode( header, target, anchor );
			appendNode( h1, header );
			appendNode( text, h1 );
			appendNode( text_1, header );

			if (slot_content_default) {
				appendNode(slot_content_default_before || (slot_content_default_before = createComment()), header);
				appendNode(slot_content_default, header);
				appendNode(slot_content_default_after || (slot_content_default_after = createComment()), header);
			}
		},

		update: noop,

		unmount: function () {
			detachNode( header );

			if (slot_content_default) {
				reinsertBetween(slot_content_default_before, slot_content_default_after, slot_content_default);
				detachNode(slot_content_default_before);
				detachNode(slot_content_default_after);
			}
		},

		destroy: noop
	};
}

function Header ( options ) {
	this.options = options;
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;
	this._bind = options._bind;
	this._slotted = options.slots || {};

	if ( !document.getElementById( 'svelte-1314837231-style' ) ) add_css$1();

	this.slots = {};

	this._fragment = create_main_fragment$1( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, options.anchor || null );
	}
}

assign( Header.prototype, proto );

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

function encapsulateStyles$2 ( node ) {
	setAttribute( node, 'svelte-3151791606', '' );
}

function add_css$2 () {
	var style = createElement( 'style' );
	style.id = 'svelte-3151791606-style';
	style.textContent = "[svelte-3151791606].editor,[svelte-3151791606] .editor{width:50%;height:100%;box-sizing:border-box;border-right:5px solid #e2e2e2}[svelte-3151791606].CodeMirror,[svelte-3151791606] .CodeMirror{height:100%}";
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
			encapsulateStyles$2( div );
			div.className = "editor";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component.refs.editor = div;
		},

		update: noop,

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			if ( component.refs.editor === div ) component.refs.editor = null;
		}
	};
}

function Editor ( options ) {
	this.options = options;
	this.refs = {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;
	this._bind = options._bind;

	if ( !document.getElementById( 'svelte-3151791606-style' ) ) add_css$2();

	var oncreate = template$1.oncreate.bind( this );

	if ( !options._root ) {
		this._oncreate = [oncreate];
	} else {
	 	this._root._oncreate.push(oncreate);
	 }

	this._fragment = create_main_fragment$2( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, options.anchor || null );
	}

	if ( !options._root ) {
		callAll(this._oncreate);
	}
}

assign( Editor.prototype, template$1.methods, proto );

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

function encapsulateStyles$3 ( node ) {
	setAttribute( node, 'svelte-99789688', '' );
}

function add_css$3 () {
	var style = createElement( 'style' );
	style.id = 'svelte-99789688-style';
	style.textContent = "[svelte-99789688].preview,[svelte-99789688] .preview{width:50%;height:100%}";
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
			encapsulateStyles$3( div );
			div.className = "preview";
			div_1.className = "renderer";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
			component.refs.preview = div_1;
		},

		update: noop,

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			if ( component.refs.preview === div_1 ) component.refs.preview = null;
		}
	};
}

function Preview ( options ) {
	this.options = options;
	this.refs = {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;
	this._bind = options._bind;

	if ( !document.getElementById( 'svelte-99789688-style' ) ) add_css$3();

	var oncreate = template$2.oncreate.bind( this );

	if ( !options._root ) {
		this._oncreate = [oncreate];
	} else {
	 	this._root._oncreate.push(oncreate);
	 }

	this._fragment = create_main_fragment$3( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, options.anchor || null );
	}

	if ( !options._root ) {
		callAll(this._oncreate);
	}
}

assign( Preview.prototype, template$2.methods, proto );

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

function encapsulateStyles$4 ( node ) {
	setAttribute( node, 'svelte-423266654', '' );
}

function add_css$4 () {
	var style = createElement( 'style' );
	style.id = 'svelte-423266654-style';
	style.textContent = "[svelte-423266654].select,[svelte-423266654] .select{width:200px}";
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
			encapsulateStyles$4( select );
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

			if ( changed.examples || changed.active ) {
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

	var current_block_type = select_block_type( state, each_block_value, example, example_index );
	var if_block = current_block_type( state, each_block_value, example, example_index, component );

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
			if ( current_block_type === ( current_block_type = select_block_type( state, each_block_value, example, example_index ) ) && if_block ) {
				if_block.update( changed, state, each_block_value, example, example_index );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block_type( state, each_block_value, example, example_index, component );
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
	var option, option_value_value, text_value = example, text;

	return {
		create: function () {
			option = createElement( 'option' );
			text = createText( text_value );
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
			if ( ( changed.examples ) && option_value_value !== ( option_value_value = example ) ) {
				option.__value = option_value_value;
			}

			option.value = option.__value;
			if ( ( changed.examples ) && text_value !== ( text_value = example ) ) {
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
	var option, option_value_value, text_value = example, text;

	return {
		create: function () {
			option = createElement( 'option' );
			text = createText( text_value );
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
			if ( ( changed.examples ) && option_value_value !== ( option_value_value = example ) ) {
				option.__value = option_value_value;
			}

			option.value = option.__value;
			if ( ( changed.examples ) && text_value !== ( text_value = example ) ) {
				text.data = text_value;
			}
		},

		unmount: function () {
			detachNode( option );
		},

		destroy: noop
	};
}

function select_block_type ( state, each_block_value, example, example_index ) {
	if ( example === state.active ) return create_if_block;
	return create_if_block_1;
}

function Examples ( options ) {
	this.options = options;
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;
	this._bind = options._bind;

	if ( !document.getElementById( 'svelte-423266654-style' ) ) add_css$4();

	this._fragment = create_main_fragment$4( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, options.anchor || null );
	}
}

assign( Examples.prototype, template$3.methods, proto );

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

function encapsulateStyles ( node ) {
	setAttribute( node, 'svelte-267949986', '' );
}

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-267949986-style';
	style.textContent = "[svelte-267949986].app,[svelte-267949986] .app{height:calc(100% - 60px)}[svelte-267949986].main,[svelte-267949986] .main{display:flex;flex-direction:row;height:100%}";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div, text, section, text_1;

	var examples = new Examples({
		_root: component._root,
		data: { examples: state.examples, active: state.activeExample }
	});

	examples.on( 'change', function ( event ) {
		component.triggerChangeExample(event.example);
	});

	var header = new Header({
		_root: component._root,
		slots: { default: createFragment() }
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
			examples._fragment.create();
			header._fragment.create();
			text = createText( "\r\n  " );
			section = createElement( 'section' );
			editor._fragment.create();
			text_1 = createText( "\r\n    " );
			preview._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles( div );
			div.className = "app";
			section.className = "main";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			examples._fragment.mount( header._slotted.default, null );
			header._fragment.mount( div, null );
			appendNode( text, div );
			appendNode( section, div );
			editor._fragment.mount( section, null );
			appendNode( text_1, section );
			preview._fragment.mount( section, null );
		},

		update: function ( changed, state ) {
			var examples_changes = {};
			if ( changed.examples ) examples_changes.examples = state.examples;
			if ( changed.activeExample ) examples_changes.active = state.activeExample;
			examples._set( examples_changes );

			var editor_changes = {};
			if ( changed.code ) editor_changes.code = state.code;
			editor._set( editor_changes );

			var preview_changes = {};
			if ( changed.layer ) preview_changes.layer = state.layer;
			preview._set( preview_changes );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			examples.destroy( false );
			header.destroy( false );
			editor.destroy( false );
			preview.destroy( false );
		}
	};
}

function App ( options ) {
	this.options = options;
	this._state = assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;
	this._bind = options._bind;

	if ( !document.getElementById( 'svelte-267949986-style' ) ) add_css();

	if ( !options._root ) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, options.anchor || null );
	}

	if ( !options._root ) {
		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign( App.prototype, template.methods, proto );

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
    return fetch(`${API_URL}${EXAMPLES_URL}`)
      .then(response => JSON.parse(response))
  }

  getExample (name) {
    return fetch(`${API_URL}${EXAMPLES_URL}/${name}`)
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
