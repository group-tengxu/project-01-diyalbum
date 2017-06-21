/**
 * @preserve SeaJS - A Module Loader for the Web
 * v1.3.0 | seajs.org | MIT Licensed
 */


/**
 * Base namespace for the framework.
 */
this.seajs = { _seajs: this.seajs }


/**
 * The version of the framework. It will be replaced with "major.minor.patch"
 * when building.
 */
seajs.version = '1.3.0'


/**
 * The private utilities. Internal use only.
 */
seajs._util = {}


/**
 * The private configuration data. Internal use only.
 */
seajs._config = {

  /**
   * Debug mode. It will be turned off automatically when compressing.
   */
  debug: '%DEBUG%',

  /**
   * Modules that are needed to load before all other modules.
   */
  preload: []
}

/**
 * The minimal language enhancement
 */
;(function(util) {

  var toString = Object.prototype.toString
  var AP = Array.prototype


  util.isString = function(val) {
    return toString.call(val) === '[object String]'
  };


  util.isFunction = function(val) {
    return toString.call(val) === '[object Function]'
  };


  util.isRegExp = function(val) {
    return toString.call(val) === '[object RegExp]'
  };


  util.isObject = function(val) {
    return val === Object(val)
  };


  util.isArray = Array.isArray || function(val) {
    return toString.call(val) === '[object Array]'
  };


  util.indexOf = AP.indexOf ?
      function(arr, item) {
        return arr.indexOf(item)
      } :
      function(arr, item) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === item) {
            return i
          }
        }
        return -1
      };


  var forEach = util.forEach = AP.forEach ?
      function(arr, fn) {
        arr.forEach(fn)
      } :
      function(arr, fn) {
        for (var i = 0; i < arr.length; i++) {
          fn(arr[i], i, arr)
        };
      }


  util.map = AP.map ?
      function(arr, fn) {
        return arr.map(fn)
      } :
      function(arr, fn) {
        var ret = []
        forEach(arr, function(item, i, arr) {
          ret.push(fn(item, i, arr))
        })
        return ret
      };


  util.filter = AP.filter ?
      function(arr, fn) {
        return arr.filter(fn)
      } :
      function(arr, fn) {
        var ret = []
        forEach(arr, function(item, i, arr) {
          if (fn(item, i, arr)) {
            ret.push(item)
          }
        })
        return ret
      };


  var keys = util.keys = Object.keys || function(o) {
    var ret = []

    for (var p in o) {
      if (o.hasOwnProperty(p)) {
        ret.push(p)
      }
    }

    return ret
  };


  util.unique = function(arr) {
    var o = {}

    forEach(arr, function(item) {
      o[item] = 1
    })

    return keys(o)
  };


  util.now = Date.now || function() {
    return new Date().getTime();
  };

})(seajs._util)

/**
 * The tiny console
 */
;(function(util) {

  /**
   * The safe wrapper of console.log/error/...
   */
  util.log = function() {
    if (typeof console === 'undefined') return

    var args = Array.prototype.slice.call(arguments)

    var type = 'log'
    var last = args[args.length - 1]
    console[last] && (type = args.pop())

    // Only show log info in debug mode
    if (type === 'log' && !seajs.debug) return

    if (console[type].apply) {
      console[type].apply(console, args)
      return
    }

    // See issue#349
    var length = args.length
    if (length === 1) {
      console[type](args[0])
    }
    else if (length === 2) {
      console[type](args[0], args[1])
    }
    else if (length === 3) {
      console[type](args[0], args[1], args[2])
    }
    else {
      console[type](args.join(' '))
    };
  }

})(seajs._util)

/**
 * Path utilities
 */
;(function(util, config, global) {

  var DIRNAME_RE = /.*(?=\/.*$)/
  var MULTIPLE_SLASH_RE = /([^:\/])\/\/+/g
  var FILE_EXT_RE = /\.(?:css|js)$/
  var ROOT_RE = /^(.*?\w)(?:\/|$)/


  /**
   * Extracts the directory portion of a path.
   * dirname('a/b/c.js') ==> 'a/b/'
   * dirname('d.js') ==> './'
   * @see http://jsperf.com/regex-vs-split/2
   */
  function dirname(path) {
    var s = path.match(DIRNAME_RE)
    return (s ? s[0] : '.') + '/'
  }


  /**
   * Canonicalizes a path.
   * realpath('./a//b/../c') ==> 'a/c'
   */
  function realpath(path) {
    MULTIPLE_SLASH_RE.lastIndex = 0

    // 'file:///a//b/c' ==> 'file:///a/b/c'
    // 'http://a//b/c' ==> 'http://a/b/c'
    if (MULTIPLE_SLASH_RE.test(path)) {
      path = path.replace(MULTIPLE_SLASH_RE, '$1\/')
    }

    // 'a/b/c', just return.
    if (path.indexOf('.') === -1) {
      return path
    }

    var original = path.split('/')
    var ret = [], part

    for (var i = 0; i < original.length; i++) {
      part = original[i]

      if (part === '..') {
        if (ret.length === 0) {
          throw new Error('The path is invalid: ' + path)
        }
        ret.pop()
      }
      else if (part !== '.') {
        ret.push(part)
      }
    }

    return ret.join('/')
  }


  /**
   * Normalizes an uri.
   */
  function normalize(uri) {
    uri = realpath(uri)
    var lastChar = uri.charAt(uri.length - 1)

    if (lastChar === '/') {
      return uri
    }

    // Adds the default '.js' extension except that the uri ends with #.
    // ref: http://jsperf.com/get-the-last-character
    if (lastChar === '#') {
      uri = uri.slice(0, -1)
    }
    else if (uri.indexOf('?') === -1 && !FILE_EXT_RE.test(uri)) {
      uri += '.js'
    }

    // Remove ':80/' for bug in IE
    if (uri.indexOf(':80/') > 0) {
      uri = uri.replace(':80/', '/')
    }

    return uri
  }


  /**
   * Parses alias in the module id. Only parse the first part.
   */
  function parseAlias(id) {
    // #xxx means xxx is already alias-parsed.
    if (id.charAt(0) === '#') {
      return id.substring(1)
    }

    var alias = config.alias

    // Only top-level id needs to parse alias.
    if (alias && isTopLevel(id)) {
      var parts = id.split('/')
      var first = parts[0]

      if (alias.hasOwnProperty(first)) {
        parts[0] = alias[first]
        id = parts.join('/')
      }
    }

    return id
  }


  var mapCache = {}

  /**
   * Converts the uri according to the map rules.
   */
  function parseMap(uri) {
    // map: [[match, replace], ...]
    var map = config.map || []
    if (!map.length) return uri

    var ret = uri

    // Apply all matched rules in sequence.
    for (var i = 0; i < map.length; i++) {
      var rule = map[i]

      if (util.isArray(rule) && rule.length === 2) {
        var m = rule[0]

        if (util.isString(m) && ret.indexOf(m) > -1 ||
            util.isRegExp(m) && m.test(ret)) {
          ret = ret.replace(m, rule[1])
        }
      }
      else if (util.isFunction(rule)) {
        ret = rule(ret)
      }
    }

    if (!isAbsolute(ret)) {
      ret = realpath(dirname(pageUri) + ret)
    }

    if (ret !== uri) {
      mapCache[ret] = uri
    }

    return ret
  }


  /**
   * Gets the original uri.
   */
  function unParseMap(uri) {
    return mapCache[uri] || uri
  }


  /**
   * Converts id to uri.
   */
  function id2Uri(id, refUri) {
    if (!id) return ''

    id = parseAlias(id)
    refUri || (refUri = pageUri)

    var ret

    // absolute id
    if (isAbsolute(id)) {
      ret = id
    }
    // relative id
    else if (isRelative(id)) {
      // Converts './a' to 'a', to avoid unnecessary loop in realpath.
      if (id.indexOf('./') === 0) {
        id = id.substring(2)
      }
      ret = dirname(refUri) + id
    }
    // root id
    else if (isRoot(id)) {
      ret = refUri.match(ROOT_RE)[1] + id
    }
    // top-level id
    else {
      ret = config.base + '/' + id
    }

    return normalize(ret)
  }


  function isAbsolute(id) {
    return id.indexOf('://') > 0 || id.indexOf('//') === 0
  }


  function isRelative(id) {
    return id.indexOf('./') === 0 || id.indexOf('../') === 0
  }


  function isRoot(id) {
    return id.charAt(0) === '/' && id.charAt(1) !== '/'
  }


  function isTopLevel(id) {
    var c = id.charAt(0)
    return id.indexOf('://') === -1 && c !== '.' && c !== '/'
  }


  /**
   * Normalizes pathname to start with '/'
   * Ref: https://groups.google.com/forum/#!topic/seajs/9R29Inqk1UU
   */
  function normalizePathname(pathname) {
    if (pathname.charAt(0) !== '/') {
      pathname = '/' + pathname
    }
    return pathname
  }


  var loc = global['location']
  var pageUri = loc.protocol + '//' + loc.host +
      normalizePathname(loc.pathname)

  // local file in IE: C:\path\to\xx.js
  if (pageUri.indexOf('\\') > 0) {
    pageUri = pageUri.replace(/\\/g, '/')
  }


  util.dirname = dirname
  util.realpath = realpath
  util.normalize = normalize

  util.parseAlias = parseAlias
  util.parseMap = parseMap
  util.unParseMap = unParseMap

  util.id2Uri = id2Uri
  util.isAbsolute = isAbsolute
  util.isRoot = isRoot
  util.isTopLevel = isTopLevel

  util.pageUri = pageUri

})(seajs._util, seajs._config, this)

/**
 * Utilities for fetching js and css files
 */
;(function(util, config) {

  var doc = document
  var head = doc.head ||
      doc.getElementsByTagName('head')[0] ||
      doc.documentElement

  var baseElement = head.getElementsByTagName('base')[0]

  var IS_CSS_RE = /\.css(?:\?|$)/i
  var READY_STATE_RE = /loaded|complete|undefined/

  var currentlyAddingScript
  var interactiveScript


  util.fetch = function(url, callback, charset) {
    var isCSS = IS_CSS_RE.test(url)
    var node = document.createElement(isCSS ? 'link' : 'script')

    if (charset) {
      var cs = util.isFunction(charset) ? charset(url) : charset
      cs && (node.charset = cs)
    }

    assetOnload(node, callback || noop)

    if (isCSS) {
      node.rel = 'stylesheet'
      node.href = url
    } else {
      node.async = 'async'
      node.src = url
    }

    // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
    // the end of the insertBefore execution, so use `currentlyAddingScript`
    // to hold current node, for deriving url in `define`.
    currentlyAddingScript = node

    // ref: #185 & http://dev.jquery.com/ticket/2709
    baseElement ?
        head.insertBefore(node, baseElement) :
        head.appendChild(node)

    currentlyAddingScript = null
  };

  function assetOnload(node, callback) {
    if (node.nodeName === 'SCRIPT') {
      scriptOnload(node, callback)
    } else {
      styleOnload(node, callback)
    }
  }

  function scriptOnload(node, callback) {

    node.onload = node.onerror = node.onreadystatechange = function() {
      if (READY_STATE_RE.test(node.readyState)) {

        // Ensure only run once and handle memory leak in IE
        node.onload = node.onerror = node.onreadystatechange = null

        // Remove the script to reduce memory leak
        if (node.parentNode && !config.debug) {
          head.removeChild(node)
        }

        // Dereference the node
        node = undefined

        callback()
      };
    }

  }

  function styleOnload(node, callback) {

    // for Old WebKit and Old Firefox
    if (isOldWebKit || isOldFirefox) {
      util.log('Start poll to fetch css')

      setTimeout(function() {
        poll(node, callback)
      }, 1) // Begin after node insertion
    }
    else {
      node.onload = node.onerror = function() {
        node.onload = node.onerror = null
        node = undefined
        callback();
      }
    }

  }

  function poll(node, callback) {
    var isLoaded

    // for WebKit < 536
    if (isOldWebKit) {
      if (node['sheet']) {
        isLoaded = true
      }
    }
    // for Firefox < 9.0
    else if (node['sheet']) {
      try {
        if (node['sheet'].cssRules) {
          isLoaded = true
        }
      } catch (ex) {
        // The value of `ex.name` is changed from
        // 'NS_ERROR_DOM_SECURITY_ERR' to 'SecurityError' since Firefox 13.0
        // But Firefox is less than 9.0 in here, So it is ok to just rely on
        // 'NS_ERROR_DOM_SECURITY_ERR'
        if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
          isLoaded = true
        }
      }
    }

    setTimeout(function() {
      if (isLoaded) {
        // Place callback in here due to giving time for style rendering.
        callback()
      } else {
        poll(node, callback)
      }
    }, 1)
  }

  function noop() {
  }


  util.getCurrentScript = function() {
    if (currentlyAddingScript) {
      return currentlyAddingScript
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script.
    // Ref: http://goo.gl/JHfFW
    if (interactiveScript &&
        interactiveScript.readyState === 'interactive') {
      return interactiveScript
    }

    var scripts = head.getElementsByTagName('script')

    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i]
      if (script.readyState === 'interactive') {
        interactiveScript = script
        return script
      };
    }
  }

  util.getScriptAbsoluteSrc = function(node) {
    return node.hasAttribute ? // non-IE6/7
        node.src :
        // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
        node.getAttribute('src', 4)
  }


  util.importStyle = function(cssText, id) {
    // Don't add multi times
    if (id && doc.getElementById(id)) return

    var element = doc.createElement('style')
    id && (element.id = id)

    // Adds to DOM first to avoid the css hack invalid
    head.appendChild(element)

    // IE
    if (element.styleSheet) {
      element.styleSheet.cssText = cssText
    }
    // W3C
    else {
      element.appendChild(doc.createTextNode(cssText))
    };
  }


  var UA = navigator.userAgent

  // `onload` event is supported in WebKit since 535.23
  // Ref:
  //  - https://bugs.webkit.org/show_activity.cgi?id=38995
  var isOldWebKit = Number(UA.replace(/.*AppleWebKit\/(\d+)\..*/, '$1')) < 536

  // `onload/onerror` event is supported since Firefox 9.0
  // Ref:
  //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
  //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
  var isOldFirefox = UA.indexOf('Firefox') > 0 &&
      !('onload' in document.createElement('link'));


  /**
   * References:
   *  - http://unixpapa.com/js/dyna.html
   *  - ../test/research/load-js-css/test.html
   *  - ../test/issues/load-css/test.html
   *  - http://www.blaze.io/technical/ies-premature-execution-problem/
   */

})(seajs._util, seajs._config, this)

/**
 * The parser for dependencies
 */
;(function(util) {

  var REQUIRE_RE = /(?:^|[^.$])\brequire\s*\(\s*(["'])([^"'\s\)]+)\1\s*\)/g


  util.parseDependencies = function(code) {
    // Parse these `requires`:
    //   var a = require('a');
    //   someMethod(require('b'));
    //   require('c');
    //   ...
    // Doesn't parse:
    //   someInstance.require(...);
    var ret = [], match

    code = removeComments(code)
    REQUIRE_RE.lastIndex = 0

    while ((match = REQUIRE_RE.exec(code))) {
      if (match[2]) {
        ret.push(match[2])
      }
    }

    return util.unique(ret)
  };

  // See: research/remove-comments-safely
  function removeComments(code) {
    return code
        .replace(/^\s*\/\*[\s\S]*?\*\/\s*$/mg, '') // block comments
        .replace(/^\s*\/\/.*$/mg, '') // line comments
  }

})(seajs._util)

/**
 * The core of loader
 */
;(function(seajs, util, config) {

  var cachedModules = {}
  var cachedModifiers = {}
  var compileStack = []

  var STATUS = {
    'FETCHING': 1,  // The module file is fetching now.
    'FETCHED': 2,   // The module file has been fetched.
    'SAVED': 3,     // The module info has been saved.
    'READY': 4,     // All dependencies and self are ready to compile.
    'COMPILING': 5, // The module is in compiling now.
    'COMPILED': 6   // The module is compiled and module.exports is available.
  }


  function Module(uri, status) {
    this.uri = uri
    this.status = status || 0

    // this.id is set when saving
    // this.dependencies is set when saving
    // this.factory is set when saving
    // this.exports is set when compiling
    // this.parent is set when compiling
    // this.require is set when compiling
  }


  Module.prototype._use = function(ids, callback) {
    util.isString(ids) && (ids = [ids])
    var uris = resolve(ids, this.uri)

    this._load(uris, function() {
      // Loads preload files introduced in modules before compiling.
      preload(function() {
        var args = util.map(uris, function(uri) {
          return uri ? cachedModules[uri]._compile() : null
        })

        if (callback) {
          callback.apply(null, args)
        }
      })
    })
  };


  Module.prototype._load = function(uris, callback) {
    var unLoadedUris = util.filter(uris, function(uri) {
      return uri && (!cachedModules[uri] ||
          cachedModules[uri].status < STATUS.READY)
    })

    var length = unLoadedUris.length
    if (length === 0) {
      callback()
      return
    }

    var remain = length

    for (var i = 0; i < length; i++) {
      (function(uri) {
        var module = cachedModules[uri] ||
            (cachedModules[uri] = new Module(uri, STATUS.FETCHING))

        module.status >= STATUS.FETCHED ? onFetched() : fetch(uri, onFetched)

        function onFetched() {
          // cachedModules[uri] is changed in un-correspondence case
          module = cachedModules[uri]

          if (module.status >= STATUS.SAVED) {
            var deps = getPureDependencies(module)

            if (deps.length) {
              Module.prototype._load(deps, function() {
                cb(module)
              })
            }
            else {
              cb(module)
            }
          }
          // Maybe failed to fetch successfully, such as 404 or non-module.
          // In these cases, just call cb function directly.
          else {
            cb()
          }
        }

      })(unLoadedUris[i])
    }

    function cb(module) {
      (module || {}).status < STATUS.READY && (module.status = STATUS.READY);
      --remain === 0 && callback()
    };
  }


  Module.prototype._compile = function() {
    var module = this
    if (module.status === STATUS.COMPILED) {
      return module.exports
    }

    // Just return null when:
    //  1. the module file is 404.
    //  2. the module file is not written with valid module format.
    //  3. other error cases.
    if (module.status < STATUS.SAVED && !hasModifiers(module)) {
      return null
    }

    module.status = STATUS.COMPILING


    function require(id) {
      var uri = resolve(id, module.uri)
      var child = cachedModules[uri]

      // Just return null when uri is invalid.
      if (!child) {
        return null
      }

      // Avoids circular calls.
      if (child.status === STATUS.COMPILING) {
        return child.exports
      }

      child.parent = module
      return child._compile()
    }

    require.async = function(ids, callback) {
      module._use(ids, callback)
    };

    require.resolve = function(id) {
      return resolve(id, module.uri)
    };

    require.cache = cachedModules


    module.require = require
    module.exports = {}
    var factory = module.factory

    if (util.isFunction(factory)) {
      compileStack.push(module)
      runInModuleContext(factory, module)
      compileStack.pop()
    }
    else if (factory !== undefined) {
      module.exports = factory
    }

    module.status = STATUS.COMPILED
    execModifiers(module)
    return module.exports
  };


  Module._define = function(id, deps, factory) {
    var argsLength = arguments.length

    // define(factory)
    if (argsLength === 1) {
      factory = id
      id = undefined
    }
    // define(id || deps, factory)
    else if (argsLength === 2) {
      factory = deps
      deps = undefined

      // define(deps, factory)
      if (util.isArray(id)) {
        deps = id
        id = undefined
      }
    }

    // Parses dependencies.
    if (!util.isArray(deps) && util.isFunction(factory)) {
      deps = util.parseDependencies(factory.toString())
    }

    var meta = { id: id, dependencies: deps, factory: factory }
    var derivedUri

    // Try to derive uri in IE6-9 for anonymous modules.
    if (document.attachEvent) {
      // Try to get the current script.
      var script = util.getCurrentScript()
      if (script) {
        derivedUri = util.unParseMap(util.getScriptAbsoluteSrc(script))
      }

      if (!derivedUri) {
        util.log('Failed to derive URI from interactive script for:',
            factory.toString(), 'warn')

        // NOTE: If the id-deriving methods above is failed, then falls back
        // to use onload event to get the uri.
      }
    }

    // Gets uri directly for specific module.
    var resolvedUri = id ? resolve(id) : derivedUri

    if (resolvedUri) {
      // For IE:
      // If the first module in a package is not the cachedModules[derivedUri]
      // self, it should assign to the correct module when found.
      if (resolvedUri === derivedUri) {
        var refModule = cachedModules[derivedUri]
        if (refModule && refModule.realUri &&
            refModule.status === STATUS.SAVED) {
          cachedModules[derivedUri] = null
        }
      }

      var module = Module._save(resolvedUri, meta)

      // For IE:
      // Assigns the first module in package to cachedModules[derivedUrl]
      if (derivedUri) {
        // cachedModules[derivedUri] may be undefined in combo case.
        if ((cachedModules[derivedUri] || {}).status === STATUS.FETCHING) {
          cachedModules[derivedUri] = module
          module.realUri = derivedUri
        }
      }
      else {
        firstModuleInPackage || (firstModuleInPackage = module)
      }
    }
    else {
      // Saves information for "memoizing" work in the onload event.
      anonymousModuleMeta = meta
    };

  }


  Module._getCompilingModule = function() {
    return compileStack[compileStack.length - 1]
  };


  Module._find = function(selector) {
    var matches = []

    util.forEach(util.keys(cachedModules), function(uri) {
      if (util.isString(selector) && uri.indexOf(selector) > -1 ||
          util.isRegExp(selector) && selector.test(uri)) {
        var module = cachedModules[uri]
        module.exports && matches.push(module.exports)
      }
    })

    return matches
  }


  Module._modify = function(id, modifier) {
    var uri = resolve(id)
    var module = cachedModules[uri]

    if (module && module.status === STATUS.COMPILED) {
      runInModuleContext(modifier, module)
    }
    else {
      cachedModifiers[uri] || (cachedModifiers[uri] = [])
      cachedModifiers[uri].push(modifier)
    }

    return seajs
  }


  // For plugin developers
  Module.STATUS = STATUS
  Module._resolve = util.id2Uri
  Module._fetch = util.fetch
  Module._save = save


  // Helpers
  // -------

  var fetchingList = {}
  var fetchedList = {}
  var callbackList = {}
  var anonymousModuleMeta = null
  var firstModuleInPackage = null
  var circularCheckStack = []

  function resolve(ids, refUri) {
    if (util.isString(ids)) {
      return Module._resolve(ids, refUri)
    }

    return util.map(ids, function(id) {
      return resolve(id, refUri)
    })
  }

  function fetch(uri, callback) {
    var requestUri = util.parseMap(uri)

    if (fetchedList[requestUri]) {
      // See test/issues/debug-using-map
      cachedModules[uri] = cachedModules[requestUri]
      callback()
      return
    }

    if (fetchingList[requestUri]) {
      callbackList[requestUri].push(callback)
      return
    }

    fetchingList[requestUri] = true
    callbackList[requestUri] = [callback]

    // Fetches it
    Module._fetch(
        requestUri,

        function() {
          fetchedList[requestUri] = true

          // Updates module status
          var module = cachedModules[uri]
          if (module.status === STATUS.FETCHING) {
            module.status = STATUS.FETCHED
          }

          // Saves anonymous module meta data
          if (anonymousModuleMeta) {
            Module._save(uri, anonymousModuleMeta)
            anonymousModuleMeta = null
          }

          // Assigns the first module in package to cachedModules[uri]
          // See: test/issues/un-correspondence
          if (firstModuleInPackage && module.status === STATUS.FETCHED) {
            cachedModules[uri] = firstModuleInPackage
            firstModuleInPackage.realUri = uri
          }
          firstModuleInPackage = null

          // Clears
          if (fetchingList[requestUri]) {
            delete fetchingList[requestUri]
          }

          // Calls callbackList
          var fns = callbackList[requestUri]
          if (fns) {
            delete callbackList[requestUri]
            util.forEach(fns, function(fn) {
              fn()
            })
          }

        },

        config.charset
    )
  }

  function save(uri, meta) {
    var module = cachedModules[uri] || (cachedModules[uri] = new Module(uri))

    // Don't override already saved module
    if (module.status < STATUS.SAVED) {
      // Lets anonymous module id equal to its uri
      module.id = meta.id || uri

      module.dependencies = resolve(
          util.filter(meta.dependencies || [], function(dep) {
            return !!dep
          }), uri)

      module.factory = meta.factory

      // Updates module status
      module.status = STATUS.SAVED
    }

    return module
  }

  function runInModuleContext(fn, module) {
    var ret = fn(module.require, module.exports, module)
    if (ret !== undefined) {
      module.exports = ret
    }
  }

  function hasModifiers(module) {
    return !!cachedModifiers[module.realUri || module.uri]
  }

  function execModifiers(module) {
    var uri = module.realUri || module.uri
    var modifiers = cachedModifiers[uri]

    if (modifiers) {
      util.forEach(modifiers, function(modifier) {
        runInModuleContext(modifier, module)
      })

      delete cachedModifiers[uri]
    }
  }

  function getPureDependencies(module) {
    var uri = module.uri

    return util.filter(module.dependencies, function(dep) {
      circularCheckStack = [uri]

      var isCircular = isCircularWaiting(cachedModules[dep])
      if (isCircular) {
        circularCheckStack.push(uri)
        printCircularLog(circularCheckStack)
      }

      return !isCircular
    })
  }

  function isCircularWaiting(module) {
    if (!module || module.status !== STATUS.SAVED) {
      return false
    }

    circularCheckStack.push(module.uri)
    var deps = module.dependencies

    if (deps.length) {
      if (isOverlap(deps, circularCheckStack)) {
        return true
      }

      for (var i = 0; i < deps.length; i++) {
        if (isCircularWaiting(cachedModules[deps[i]])) {
          return true
        }
      }
    }

    circularCheckStack.pop()
    return false
  }

  function printCircularLog(stack, type) {
    util.log('Found circular dependencies:', stack.join(' --> '), type)
  }

  function isOverlap(arrA, arrB) {
    var arrC = arrA.concat(arrB)
    return arrC.length > util.unique(arrC).length
  }

  function preload(callback) {
    var preloadMods = config.preload.slice()
    config.preload = []
    preloadMods.length ? globalModule._use(preloadMods, callback) : callback()
  }


  // Public API
  // ----------

  var globalModule = new Module(util.pageUri, STATUS.COMPILED)

  seajs.use = function(ids, callback) {
    // Loads preload modules before all other modules.
    preload(function() {
      globalModule._use(ids, callback)
    })

    // Chain
    return seajs
  };


  // For normal users
  seajs.define = Module._define
  seajs.cache = Module.cache = cachedModules
  seajs.find = Module._find
  seajs.modify = Module._modify


  // For plugin developers
  Module.fetchedList = fetchedList
  seajs.pluginSDK = {
    Module: Module,
    util: util,
    config: config
    };

})(seajs, seajs._util, seajs._config)

/**
 * The configuration
 */
;(function(seajs, util, config) {

  var noCachePrefix = 'seajs-ts='
  var noCacheTimeStamp = noCachePrefix + util.now()


  // Async inserted script
  var loaderScript = document.getElementById('seajsnode')

  // Static script
  if (!loaderScript) {
    var scripts = document.getElementsByTagName('script')
    loaderScript = scripts[scripts.length - 1]
  }

  var loaderSrc = (loaderScript && util.getScriptAbsoluteSrc(loaderScript)) ||
      util.pageUri // When sea.js is inline, set base to pageUri.

  var base = util.dirname(getLoaderActualSrc(loaderSrc))
  util.loaderDir = base

  // When src is "http://test.com/libs/seajs/1.0.0/sea.js", redirect base
  // to "http://test.com/libs/"
  var match = base.match(/^(.+\/)seajs\/[\.\d]+(?:-dev)?\/$/)
  if (match) base = match[1]

  config.base = base
  config.main = loaderScript && loaderScript.getAttribute('data-main')
  config.charset = 'utf-8'


  /**
   * The function to configure the framework
   * config({
   *   'base': 'path/to/base',
   *   'alias': {
   *     'app': 'biz/xx',
   *     'jquery': 'jquery-1.5.2',
   *     'cart': 'cart?t=20110419'
   *   },
   *   'map': [
   *     ['test.cdn.cn', 'localhost']
   *   ],
   *   preload: [],
   *   charset: 'utf-8',
   *   debug: false
   * })
   *
   */
  seajs.config = function(o) {
    for (var k in o) {
      if (!o.hasOwnProperty(k)) continue

      var previous = config[k]
      var current = o[k]

      if (previous && k === 'alias') {
        for (var p in current) {
          if (current.hasOwnProperty(p)) {

            var prevValue = previous[p]
            var currValue = current[p]

            // Converts {jquery: '1.7.2'} to {jquery: 'jquery/1.7.2/jquery'}
            if (/^\d+\.\d+\.\d+$/.test(currValue)) {
              currValue = p + '/' + currValue + '/' + p
            }

            checkAliasConflict(prevValue, currValue, p)
            previous[p] = currValue

          }
        }
      }
      else if (previous && (k === 'map' || k === 'preload')) {
        // for config({ preload: 'some-module' })
        if (util.isString(current)) {
          current = [current]
        }

        util.forEach(current, function(item) {
          if (item) {
            previous.push(item)
          }
        })
      }
      else {
        config[k] = current
      }
    }

    // Makes sure config.base is an absolute path.
    var base = config.base
    if (base && !util.isAbsolute(base)) {
      config.base = util.id2Uri((util.isRoot(base) ? '' : './') + base + '/')
    }

    // Uses map to implement nocache.
    if (config.debug === 2) {
      config.debug = 1
      seajs.config({
        map: [
          [/^.*$/, function(url) {
            if (url.indexOf(noCachePrefix) === -1) {
              url += (url.indexOf('?') === -1 ? '?' : '&') + noCacheTimeStamp
            }
            return url
          }]
        ]
      })
    }

    debugSync()

    return this
  };


  function debugSync() {
    if (config.debug) {
      // For convenient reference
      seajs.debug = !!config.debug
    }
  }

  debugSync()


  function getLoaderActualSrc(src) {
    if (src.indexOf('??') === -1) {
      return src
    }

    // Such as: http://cdn.com/??seajs/1.2.0/sea.js,jquery/1.7.2/jquery.js
    // Only support nginx combo style rule. If you use other combo rule, please
    // explicitly config the base path and the alias for plugins.
    var parts = src.split('??')
    var root = parts[0]
    var paths = util.filter(parts[1].split(','), function(str) {
      return str.indexOf('sea.js') !== -1
    })

    return root + paths[0]
  }

  function checkAliasConflict(previous, current, key) {
    if (previous && previous !== current) {
      util.log('The alias config is conflicted:',
          'key =', '"' + key + '"',
          'previous =', '"' + previous + '"',
          'current =', '"' + current + '"',
          'warn')
    }
  }

})(seajs, seajs._util, seajs._config)

/**
 * Prepare for bootstrapping
 */
;(function(seajs, util, global) {

  // The safe and convenient version of console.log
  seajs.log = util.log


  // Creates a stylesheet from a text blob of rules.
  seajs.importStyle = util.importStyle


  // Sets a alias to `sea.js` directory for loading plugins.
  seajs.config({
    alias: { seajs: util.loaderDir }
  })


  // Uses `seajs-xxx` flag to load plugin-xxx.
  util.forEach(getStartupPlugins(), function(name) {
    seajs.use('seajs/plugin-' + name)

    // Delays `seajs.use` calls to the onload of `mapfile` in debug mode.
    if (name === 'debug') {
      seajs._use = seajs.use
      seajs._useArgs = []
      seajs.use = function() { seajs._useArgs.push(arguments); return seajs }
    }
  });


  // Helpers
  // -------

  function getStartupPlugins() {
    var ret = []
    var str = global.location.search

    // Converts `seajs-xxx` to `seajs-xxx=1`
    str = str.replace(/(seajs-\w+)(&|$)/g, '$1=1$2')

    // Add cookie string
    str += ' ' + document.cookie

    // Excludes seajs-xxx=0
    str.replace(/seajs-(\w+)=[1-9]/g, function(m, name) {
      ret.push(name)
    })

    return util.unique(ret)
  }

})(seajs, seajs._util, this)

/**
 * The bootstrap and entrances
 */
;(function(seajs, config, global) {

  var _seajs = seajs._seajs

  // Avoids conflicting when sea.js is loaded multi times.
  if (_seajs && !_seajs['args']) {
    global.seajs = seajs._seajs
    return
  }


  // Assigns to global define.
  global.define = seajs.define


  // Loads the data-main module automatically.
  config.main && seajs.use(config.main)


    // Parses the pre-call of seajs.config/seajs.use/define.
  // Ref: test/bootstrap/async-3.html
  ;(function(args) {
    if (args) {
      var hash = {
        0: 'config',
        1: 'use',
        2: 'define'
      }
      for (var i = 0; i < args.length; i += 2) {
        seajs[hash[args[i]]].apply(seajs, args[i + 1])
      }
    }
  })((_seajs || 0)['args'])


  // Add define.amd property for clear indicator.
  global.define.cmd = {}


  // Keeps clean!
  delete seajs.define
  delete seajs._util
  delete seajs._config
  delete seajs._seajs

})(seajs, seajs._config, this)


var loaderPath = seajs.pluginSDK.util.loaderDir;
seajs.config({
  map : [
    ['.js', '-min.js']
  ],
  alias : {
    'bui' : loaderPath
  },
  charset: 'utf-8'
});

var BUI = BUI || {};

BUI.use = seajs.use;

BUI.config = seajs.config;

BUI.setDebug = function (debug) {
  BUI.debug = debug;
  if(debug){
    seajs.config({
      map : [
        ['-min.js', '.js']
      ]
    });
  }else{
    seajs.config({
      map : [
        ['.js', '-min.js']
      ]
    });
  }
}
define('bui/common',['bui/ua','bui/json','bui/date','bui/array','bui/keycode','bui/observable','bui/observable','bui/base','bui/component'],function(require){

  var BUI = require('bui/util');

  BUI.mix(BUI,{
    UA : require('bui/ua'),
    JSON : require('bui/json'),
    Date : require('bui/date'),
    Array : require('bui/array'),
    KeyCode : require('bui/keycode'),
    Observable : require('bui/observable'),
    Base : require('bui/base'),
    Component : require('bui/component')
  });
  return BUI;
});
/**
 * @class BUI.Util
 * \u63a7\u4ef6\u5e93\u7684\u5de5\u5177\u65b9\u6cd5\uff0c\u8fd9\u4e9b\u5de5\u5177\u65b9\u6cd5\u76f4\u63a5\u7ed1\u5b9a\u5230BUI\u5bf9\u8c61\u4e0a
 * <pre><code>
 *     BUI.isString(str);
 *
 *     BUI.extend(A,B);
 *
 *     BUI.mix(A,{a:'a'});
 * </code></pre>
 * @singleton
 */  
var BUI = BUI || {};

define('bui/util',function(){
  
    //\u517c\u5bb9jquery 1.6\u4ee5\u4e0b
    (function($){
      if($.fn){
        $.fn.on = $.fn.on || $.fn.bind;
        $.fn.off = $.fn.off || $.fn.unbind;
      }
     
    })(jQuery);
    
  var win = window,
    doc = document,
    objectPrototype = Object.prototype,
    toString = objectPrototype.toString,
    ATTRS = 'ATTRS',
    PARSER = 'PARSER',
    GUID_DEFAULT = 'guid';

  $.extend(BUI,
  {
    /**
     * \u7248\u672c\u53f7
     * @memberOf BUI
     * @type {Number}
     */
    version:1.0,

    /**
     * \u5b50\u7248\u672c\u53f7
     * @type {String}
     */
    subVersion : 2,

    /**
     * \u662f\u5426\u4e3a\u51fd\u6570
     * @param  {*} fn \u5bf9\u8c61
     * @return {Boolean}  \u662f\u5426\u51fd\u6570
     */
    isFunction : function(fn){
      return typeof(fn) === 'function';
    },
    /**
     * \u662f\u5426\u6570\u7ec4
     * @method 
     * @param  {*}  obj \u662f\u5426\u6570\u7ec4
     * @return {Boolean}  \u662f\u5426\u6570\u7ec4
     */
    isArray : ('isArray' in Array) ? Array.isArray : function(value) {
        return toString.call(value) === '[object Array]';
    },
    /**
     * \u662f\u5426\u65e5\u671f
     * @param  {*}  value \u5bf9\u8c61
     * @return {Boolean}  \u662f\u5426\u65e5\u671f
     */
    isDate: function(value) {
        return toString.call(value) === '[object Date]';
    },
    /**
     * \u662f\u5426\u662fjavascript\u5bf9\u8c61
     * @param {Object} value The value to test
     * @return {Boolean}
     * @method
     */
    isObject: (toString.call(null) === '[object Object]') ?
    function(value) {
        // check ownerDocument here as well to exclude DOM nodes
        return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
    } :
    function(value) {
        return toString.call(value) === '[object Object]';
    },
    /**
     * \u5c06\u6307\u5b9a\u7684\u65b9\u6cd5\u6216\u5c5e\u6027\u653e\u5230\u6784\u9020\u51fd\u6570\u7684\u539f\u578b\u94fe\u4e0a\uff0c
     * \u51fd\u6570\u652f\u6301\u591a\u4e8e2\u4e2a\u53d8\u91cf\uff0c\u540e\u9762\u7684\u53d8\u91cf\u540cs1\u4e00\u6837\u5c06\u5176\u6210\u5458\u590d\u5236\u5230\u6784\u9020\u51fd\u6570\u7684\u539f\u578b\u94fe\u4e0a\u3002
     * @param  {Function} r  \u6784\u9020\u51fd\u6570
     * @param  {Object} s1 \u5c06s1 \u7684\u6210\u5458\u590d\u5236\u5230\u6784\u9020\u51fd\u6570\u7684\u539f\u578b\u94fe\u4e0a
     *			@example
     *			BUI.augment(class1,{
     *				method1: function(){
     *   
     *				}
     *			});
     */
    augment : function(r,s1){
      if(!BUI.isFunction(r))
      {
        return r;
      }
      for (var i = 1; i < arguments.length; i++) {
        BUI.mix(r.prototype,arguments[i].prototype || arguments[i]);
      };
      return r;
    },
    /**
     * \u62f7\u8d1d\u5bf9\u8c61
     * @param  {Object} obj \u8981\u62f7\u8d1d\u7684\u5bf9\u8c61
     * @return {Object} \u62f7\u8d1d\u751f\u6210\u7684\u5bf9\u8c61
     */
    cloneObject : function(obj){
            var result = BUI.isArray(obj) ? [] : {};
            
      return BUI.mix(true,result,obj);
    },
    /**
    * \u629b\u51fa\u9519\u8bef
    */
    error : function(msg){
        if(BUI.debug){
            throw msg;
        }
    },
    /**
     * \u5b9e\u73b0\u7c7b\u7684\u7ee7\u627f\uff0c\u901a\u8fc7\u7236\u7c7b\u751f\u6210\u5b50\u7c7b
     * @param  {Function} subclass
     * @param  {Function} superclass \u7236\u7c7b\u6784\u9020\u51fd\u6570
     * @param  {Object} overrides  \u5b50\u7c7b\u7684\u5c5e\u6027\u6216\u8005\u65b9\u6cd5
     * @return {Function} \u8fd4\u56de\u7684\u5b50\u7c7b\u6784\u9020\u51fd\u6570
		 * \u793a\u4f8b:
     *		@example
     *		//\u7236\u7c7b
     *		function base(){
     * 
     *		}
     *
     *		function sub(){
     * 
     *		}
     *		//\u5b50\u7c7b
     *		BUI.extend(sub,base,{
     *			method : function(){
     *    
     *			}
     *		});
     *
     *		//\u6216\u8005
     *		var sub = BUI.extend(base,{});
     */
    extend : function(subclass,superclass,overrides, staticOverrides){
      //\u5982\u679c\u53ea\u63d0\u4f9b\u7236\u7c7b\u6784\u9020\u51fd\u6570\uff0c\u5219\u81ea\u52a8\u751f\u6210\u5b50\u7c7b\u6784\u9020\u51fd\u6570
      if(!BUI.isFunction(superclass))
      {
        
        overrides = superclass;
        superclass = subclass;
        subclass =  function(){};
      }

      var create = Object.create ?
            function (proto, c) {
                return Object.create(proto, {
                    constructor: {
                        value: c
                    }
                });
            } :
            function (proto, c) {
                function F() {
                }

                F.prototype = proto;

                var o = new F();
                o.constructor = c;
                return o;
            };
      var superObj = create(superclass.prototype,subclass);//new superclass(),//\u5b9e\u4f8b\u5316\u7236\u7c7b\u4f5c\u4e3a\u5b50\u7c7b\u7684prototype
      subclass.prototype = BUI.mix(superObj,subclass.prototype);     //\u6307\u5b9a\u5b50\u7c7b\u7684prototype
      subclass.superclass = create(superclass.prototype,superclass);  
      BUI.mix(superObj,overrides);
      BUI.mix(subclass,staticOverrides);
      return subclass;
    },
    /**
     * \u751f\u6210\u552f\u4e00\u7684Id
     * @method
     * @param {String} prefix \u524d\u7f00
     * @default 'bui-guid'
     * @return {String} \u552f\u4e00\u7684\u7f16\u53f7
     */
    guid : (function(){
        var map = {};
        return function(prefix){
            prefix = prefix || BUI.prefix + GUID_DEFAULT;
            if(!map[prefix]){
                map[prefix] = 1;
            }else{
                map[prefix] += 1;
            }
            return prefix + map[prefix];
        };
    })(),
    /**
     * \u5224\u65ad\u662f\u5426\u662f\u5b57\u7b26\u4e32
     * @return {Boolean} \u662f\u5426\u662f\u5b57\u7b26\u4e32
     */
    isString : function(value){
      return typeof value === 'string';
    },
    /**
     * \u5224\u65ad\u662f\u5426\u6570\u5b57\uff0c\u7531\u4e8e$.isNumberic\u65b9\u6cd5\u4f1a\u628a '123'\u8ba4\u4e3a\u6570\u5b57
     * @return {Boolean} \u662f\u5426\u6570\u5b57
     */
    isNumber : function(value){
      return typeof value === 'number';
    },
    /**
     * \u63a7\u5236\u53f0\u8f93\u51fa\u65e5\u5fd7
     * @param  {Object} obj \u8f93\u51fa\u7684\u6570\u636e
     */
    log : function(obj){
      if(BUI.debug && win.console && win.console.log){
        win.console.log(obj);
      }
    },
    /**
    * \u5c06\u591a\u4e2a\u5bf9\u8c61\u7684\u5c5e\u6027\u590d\u5236\u5230\u4e00\u4e2a\u65b0\u7684\u5bf9\u8c61
    */
    merge : function(){
      var args = $.makeArray(arguments);
      args.unshift({});
      return BUI.mix.apply(null,args);

    },
    /**
     * \u5c01\u88c5 jQuery.extend \u65b9\u6cd5\uff0c\u5c06\u591a\u4e2a\u5bf9\u8c61\u7684\u5c5e\u6027merge\u5230\u7b2c\u4e00\u4e2a\u5bf9\u8c61\u4e2d
     * @return {Object} 
     */
    mix : function(){
      return $.extend.apply(null,arguments);
    },
    /**
    * \u521b\u9020\u9876\u5c42\u7684\u547d\u540d\u7a7a\u95f4\uff0c\u9644\u52a0\u5230window\u5bf9\u8c61\u4e0a,
    * \u5305\u542bnamespace\u65b9\u6cd5
    */
    app : function(name){
      if(!window[name]){
        window[name] = {
          namespace :function(nsName){
            return BUI.namespace(nsName,window[name]);
          }
        };
      }
      return window[name];
    },
    /**
     * \u5c06\u5176\u4ed6\u7c7b\u4f5c\u4e3amixin\u96c6\u6210\u5230\u6307\u5b9a\u7c7b\u4e0a\u9762
     * @param {Function} c \u6784\u9020\u51fd\u6570
     * @param {Array} mixins \u6269\u5c55\u7c7b
     * @param {Array} attrs \u6269\u5c55\u7684\u9759\u6001\u5c5e\u6027\uff0c\u9ed8\u8ba4\u4e3a['ATTRS']
     * @return {Function} \u4f20\u5165\u7684\u6784\u9020\u51fd\u6570
     */
    mixin : function(c,mixins,attrs){
        attrs = attrs || [ATTRS,PARSER];
        var extensions = mixins;
        if (extensions) {
            c.mixins = extensions;

            var desc = {
                // ATTRS:
                // HTML_PARSER:
            }, constructors = extensions['concat'](c);

            // [ex1,ex2]\uff0c\u6269\u5c55\u7c7b\u540e\u9762\u7684\u4f18\u5148\uff0cex2 \u5b9a\u4e49\u7684\u8986\u76d6 ex1 \u5b9a\u4e49\u7684
            // \u4e3b\u7c7b\u6700\u4f18\u5148
            BUI.each(constructors, function (ext) {
                if (ext) {
                    // \u5408\u5e76 ATTRS/HTML_PARSER \u5230\u4e3b\u7c7b
                    BUI.each(attrs, function (K) {
                        if (ext[K]) {
                            desc[K] = desc[K] || {};
                            // \u4e0d\u8986\u76d6\u4e3b\u7c7b\u4e0a\u7684\u5b9a\u4e49\uff0c\u56e0\u4e3a\u7ee7\u627f\u5c42\u6b21\u4e0a\u6269\u5c55\u7c7b\u6bd4\u4e3b\u7c7b\u5c42\u6b21\u9ad8
                            // \u4f46\u662f\u503c\u662f\u5bf9\u8c61\u7684\u8bdd\u4f1a\u6df1\u5ea6\u5408\u5e76
                            // \u6ce8\u610f\uff1a\u6700\u597d\u503c\u662f\u7b80\u5355\u5bf9\u8c61\uff0c\u81ea\u5b9a\u4e49 new \u51fa\u6765\u7684\u5bf9\u8c61\u5c31\u4f1a\u6709\u95ee\u9898(\u7528 function return \u51fa\u6765)!
                             BUI.mix(true,desc[K], ext[K]);
                        }
                    });
                }
            });

            BUI.each(desc, function (v,k) {
                c[k] = v;
            });

            var prototype = {};

            // \u4e3b\u7c7b\u6700\u4f18\u5148
            BUI.each(constructors, function (ext) {
                if (ext) {
                    var proto = ext.prototype;
                    // \u5408\u5e76\u529f\u80fd\u4ee3\u7801\u5230\u4e3b\u7c7b\uff0c\u4e0d\u8986\u76d6
                    for (var p in proto) {
                        // \u4e0d\u8986\u76d6\u4e3b\u7c7b\uff0c\u4f46\u662f\u4e3b\u7c7b\u7684\u7236\u7c7b\u8fd8\u662f\u8986\u76d6\u5427
                        if (proto.hasOwnProperty(p)) {
                            prototype[p] = proto[p];
                        }
                    }
                }
            });

            BUI.each(prototype, function (v,k) {
                c.prototype[k] = v;
            });
        }
        return c;
    },
    /**
     * \u751f\u6210\u547d\u540d\u7a7a\u95f4
     * @param  {String} name \u547d\u540d\u7a7a\u95f4\u7684\u540d\u79f0
     * @param  {Object} baseNS \u5728\u5df2\u6709\u7684\u547d\u540d\u7a7a\u95f4\u4e0a\u521b\u5efa\u547d\u540d\u7a7a\u95f4\uff0c\u9ed8\u8ba4\u201cBUI\u201d
     * @return {Object} \u8fd4\u56de\u7684\u547d\u540d\u7a7a\u95f4\u5bf9\u8c61
     *		@example
     *		BUI.namespace("Grid"); // BUI.Grid
     */
    namespace : function(name,baseNS){
      baseNS = baseNS || BUI;
      if(!name){
        return baseNS;
      }
      var list = name.split('.'),
        //firstNS = win[list[0]],
        curNS = baseNS;
      
      for (var i = 0; i < list.length; i++) {
        var nsName = list[i];
        if(!curNS[nsName]){
          curNS[nsName] = {};
        }
        curNS = curNS[nsName];
      };    
      return curNS;
    },
    /**
     * BUI \u63a7\u4ef6\u7684\u516c\u7528\u524d\u7f00
     * @type {String}
     */
    prefix : 'bui-',
    /**
     * \u66ff\u6362\u5b57\u7b26\u4e32\u4e2d\u7684\u5b57\u6bb5.
     * @param {String} str \u6a21\u7248\u5b57\u7b26\u4e32
     * @param {Object} o json data
     * @param {RegExp} [regexp] \u5339\u914d\u5b57\u7b26\u4e32\u7684\u6b63\u5219\u8868\u8fbe\u5f0f
     */
    substitute: function (str, o, regexp) {
        if (!BUI.isString(str)
            || (!BUI.isObject(o)) && !BUI.isArray(o)) {
            return str;
        }

        return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (o[name] === undefined) ? '' : o[name];
        });
    },
    /**
     * \u4f7f\u7b2c\u4e00\u4e2a\u5b57\u6bcd\u53d8\u6210\u5927\u5199
     * @param  {String} s \u5b57\u7b26\u4e32
     * @return {String} \u9996\u5b57\u6bcd\u5927\u5199\u540e\u7684\u5b57\u7b26\u4e32
     */
    ucfirst : function(s){
      s += '';
            return s.charAt(0).toUpperCase() + s.substring(1);
    },
    /**
     * \u9875\u9762\u4e0a\u7684\u4e00\u70b9\u662f\u5426\u5728\u7528\u6237\u7684\u89c6\u56fe\u5185
     * @param {Object} offset \u5750\u6807\uff0cleft,top
     * @return {Boolean} \u662f\u5426\u5728\u89c6\u56fe\u5185
     */
    isInView : function(offset){
      var left = offset.left,
        top = offset.top,
        viewWidth = BUI.viewportWidth(),
        wiewHeight = BUI.viewportHeight(),
        scrollTop = BUI.scrollTop(),
        scrollLeft = BUI.scrollLeft();
      //\u5224\u65ad\u6a2a\u5750\u6807
      if(left < scrollLeft ||left > scrollLeft + viewWidth){
        return false;
      }
      //\u5224\u65ad\u7eb5\u5750\u6807
      if(top < scrollTop || top > scrollTop + wiewHeight){
        return false;
      }
      return true;
    },
    /**
     * \u9875\u9762\u4e0a\u7684\u4e00\u70b9\u7eb5\u5411\u5750\u6807\u662f\u5426\u5728\u7528\u6237\u7684\u89c6\u56fe\u5185
     * @param {Object} top  \u7eb5\u5750\u6807
     * @return {Boolean} \u662f\u5426\u5728\u89c6\u56fe\u5185
     */
    isInVerticalView : function(top){
      var wiewHeight = BUI.viewportHeight(),
        scrollTop = BUI.scrollTop();
      
      //\u5224\u65ad\u7eb5\u5750\u6807
      if(top < scrollTop || top > scrollTop + wiewHeight){
        return false;
      }
      return true;
    },
    /**
     * \u9875\u9762\u4e0a\u7684\u4e00\u70b9\u6a2a\u5411\u5750\u6807\u662f\u5426\u5728\u7528\u6237\u7684\u89c6\u56fe\u5185
     * @param {Object} left \u6a2a\u5750\u6807
     * @return {Boolean} \u662f\u5426\u5728\u89c6\u56fe\u5185
     */
    isInHorizontalView : function(left){
      var viewWidth = BUI.viewportWidth(),     
        scrollLeft = BUI.scrollLeft();
      //\u5224\u65ad\u6a2a\u5750\u6807
      if(left < scrollLeft ||left > scrollLeft + viewWidth){
        return false;
      }
      return true;
    },
    /**
     * \u83b7\u53d6\u7a97\u53e3\u53ef\u89c6\u8303\u56f4\u5bbd\u5ea6
     * @return {Number} \u53ef\u89c6\u533a\u5bbd\u5ea6
     */
    viewportWidth : function(){
        return $(window).width();
    },
    /**
     * \u83b7\u53d6\u7a97\u53e3\u53ef\u89c6\u8303\u56f4\u9ad8\u5ea6
     * @return {Number} \u53ef\u89c6\u533a\u9ad8\u5ea6
     */
    viewportHeight:function(){
         return $(window).height();
    },
    /**
     * \u6eda\u52a8\u5230\u7a97\u53e3\u7684left\u4f4d\u7f6e
     */
    scrollLeft : function(){
        return $(window).scrollLeft();
    },
    /**
     * \u6eda\u52a8\u5230\u6a2a\u5411\u4f4d\u7f6e
     */
    scrollTop : function(){
        return $(window).scrollTop();
    },
    /**
     * \u7a97\u53e3\u5bbd\u5ea6
     * @return {Number} \u7a97\u53e3\u5bbd\u5ea6
     */
    docWidth : function(){
        var body = document.documentElement || document.body;
        return $(body).width();
    },
    /**
     * \u7a97\u53e3\u9ad8\u5ea6
     * @return {Number} \u7a97\u53e3\u9ad8\u5ea6
     */
    docHeight : function(){
        var body = document.documentElement || document.body;
        return $(body).height();
    },
    /**
     * \u904d\u5386\u6570\u7ec4\u6216\u8005\u5bf9\u8c61
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){}
     */
    each : function (elements,func) {
      if(!elements){
        return;
      }
      $.each(elements,function(k,v){
        return func(v,k);
      });
    },
    /**
     * \u5c01\u88c5\u4e8b\u4ef6\uff0c\u4fbf\u4e8e\u4f7f\u7528\u4e0a\u4e0b\u6587this,\u548c\u4fbf\u4e8e\u89e3\u9664\u4e8b\u4ef6\u65f6\u4f7f\u7528
     * @protected
     * @param  {Object} self   \u5bf9\u8c61
     * @param  {String} action \u4e8b\u4ef6\u540d\u79f0
     */
    wrapBehavior : function(self, action) {
      return self['__bui_wrap_' + action] = function (e) {
        if (!self.get('disabled')) {
            self[action](e);
        }
      };
    },
    /**
     * \u83b7\u53d6\u5c01\u88c5\u7684\u4e8b\u4ef6
     * @protected
     * @param  {Object} self   \u5bf9\u8c61
     * @param  {String} action \u4e8b\u4ef6\u540d\u79f0
     */
    getWrapBehavior : function(self, action) {
        return self['__bui_wrap_' + action];
    }

  });

  /**
  * \u8868\u5355\u5e2e\u52a9\u7c7b\uff0c\u5e8f\u5217\u5316\u3001\u53cd\u5e8f\u5217\u5316\uff0c\u8bbe\u7f6e\u503c
  * @class BUI.FormHelper
  * @singleton
  */
  var formHelper = BUI.FormHelper = {
    /**
    * \u5c06\u8868\u5355\u683c\u5f0f\u5316\u6210\u952e\u503c\u5bf9\u5f62\u5f0f
    * @param {HTMLElement} form \u8868\u5355
    * @return {Object} \u952e\u503c\u5bf9\u7684\u5bf9\u8c61
    */
    serializeToObject:function(form){
      var array = $(form).serializeArray(),
        result = {};
      BUI.each(array,function(item){
        var name = item.name;
        if(!result[name]){ //\u5982\u679c\u662f\u5355\u4e2a\u503c\uff0c\u76f4\u63a5\u8d4b\u503c
          result[name] = item.value;  
        }else{ //\u591a\u503c\u4f7f\u7528\u6570\u7ec4
          if(!BUI.isArray(result[name])){
            result[name] = [result[name]];
          }
          result[name].push(item.value);
        }
      });
      return result;
    },
    /**
     * \u8bbe\u7f6e\u8868\u5355\u7684\u503c
     * @param {HTMLElement} form \u8868\u5355
     * @param {Object} obj  \u952e\u503c\u5bf9
     */
    setFields : function(form,obj){
      for(var name in obj){
        if(obj.hasOwnProperty(name)){
          BUI.FormHelper.setField(form,name,obj[name]);
        }
      }
    },
    /**
     * \u6e05\u7a7a\u8868\u5355
     * @param  {HTMLElement} form \u8868\u5355\u5143\u7d20
     */
    clear : function(form){
      var elements = $.makeArray(form.elements);

      BUI.each(elements,function(element){
        if(element.type === 'checkbox' || element.type === 'radio' ){
          $(element).attr('checked',false);
        }else{
          $(element).val('');
        }
        $(element).change();
      });
    },
    /**
    * \u8bbe\u7f6e\u8868\u5355\u5b57\u6bb5
    * @param {HTMLElement} form \u8868\u5355\u5143\u7d20
    * @param {string} field \u5b57\u6bb5\u540d 
    * @param {string} value \u5b57\u6bb5\u503c
    */
    setField:function(form,fieldName,value){
      var fields = form.elements[fieldName];
      if(BUI.isArray(fields)){
        BUI.each(fields,function(field){
          if(field.type === 'checkbox'){
            if(field.value === value || BUI.Array.indexOf(field.value,value) !== -1){
              $(field).attr('checked',true);
            }
          }else if(field.type === 'radio' && field.value === value){
            $(field).attr('checked',true);
          }else{
            $(field).val(value);
          }
        
        });
      }else{
        $(fields).val(value);
      }
    },
    /**
     * \u83b7\u53d6\u8868\u5355\u5b57\u6bb5\u503c
     * @param {HTMLElement} form \u8868\u5355\u5143\u7d20
     * @param {string} field \u5b57\u6bb5\u540d 
     * @return {String}   \u5b57\u6bb5\u503c
     */
    getField : function(form,fieldName){
      return BUI.FormHelper.serializeToObject(form)[fieldName];
    }
  };

  return BUI;
});/**
 * @fileOverview \u6570\u7ec4\u5e2e\u52a9\u7c7b
 * @ignore
 */

/**
 * @class BUI
 * \u63a7\u4ef6\u5e93\u7684\u57fa\u7840\u547d\u540d\u7a7a\u95f4
 * @singleton
 */

define('bui/array',['bui/util'],function (r) {
  
  var BUI = r('bui/util');
  /**
   * @class BUI.Array
   * \u6570\u7ec4\u5e2e\u52a9\u7c7b
   */
  BUI.Array ={
    /**
     * \u8fd4\u56de\u6570\u7ec4\u7684\u6700\u540e\u4e00\u4e2a\u5bf9\u8c61
     * @param {Array} array \u6570\u7ec4\u6216\u8005\u7c7b\u4f3c\u4e8e\u6570\u7ec4\u7684\u5bf9\u8c61.
     * @return {*} \u6570\u7ec4\u7684\u6700\u540e\u4e00\u9879.
     */
    peek : function(array) {
      return array[array.length - 1];
    },
    /**
     * \u67e5\u627e\u8bb0\u5f55\u6240\u5728\u7684\u4f4d\u7f6e
     * @param  {*} value \u503c
     * @param  {Array} array \u6570\u7ec4\u6216\u8005\u7c7b\u4f3c\u4e8e\u6570\u7ec4\u7684\u5bf9\u8c61
     * @param  {Number} [fromIndex=0] \u8d77\u59cb\u9879\uff0c\u9ed8\u8ba4\u4e3a0
     * @return {Number} \u4f4d\u7f6e\uff0c\u5982\u679c\u4e3a -1\u5219\u4e0d\u5728\u6570\u7ec4\u5185
     */
    indexOf : function(value, array,opt_fromIndex){
       var fromIndex = opt_fromIndex == null ?
          0 : (opt_fromIndex < 0 ?
               Math.max(0, array.length + opt_fromIndex) : opt_fromIndex);

      for (var i = fromIndex; i < array.length; i++) {
        if (i in array && array[i] === value)
          return i;
      }
      return -1;
    },
    /**
     * \u6570\u7ec4\u662f\u5426\u5b58\u5728\u6307\u5b9a\u503c
     * @param  {*} value \u503c
     * @param  {Array} array \u6570\u7ec4\u6216\u8005\u7c7b\u4f3c\u4e8e\u6570\u7ec4\u7684\u5bf9\u8c61
     * @return {Boolean} \u662f\u5426\u5b58\u5728\u4e8e\u6570\u7ec4\u4e2d
     */
    contains : function(value,array){
      return BUI.Array.indexOf(value,array) >=0;
    },
    /**
     * \u904d\u5386\u6570\u7ec4\u6216\u8005\u5bf9\u8c61
     * @method 
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){}
     */
    each : BUI.each,
    /**
     * 2\u4e2a\u6570\u7ec4\u5185\u90e8\u7684\u503c\u662f\u5426\u76f8\u7b49
     * @param  {Array} a1 \u6570\u7ec41
     * @param  {Array} a2 \u6570\u7ec42
     * @return {Boolean} 2\u4e2a\u6570\u7ec4\u76f8\u7b49\u6216\u8005\u5185\u90e8\u5143\u7d20\u662f\u5426\u76f8\u7b49
     */
    equals : function(a1,a2){
      if(a1 == a2){
        return true;
      }
      if(!a1 || !a2){
        return false;
      }

      if(a1.length != a2.length){
        return false;
      }
      var rst = true;
      for(var i = 0 ;i < a1.length; i++){
        if(a1[i] !== a2[i]){
          rst = false;
          break;
        }
      }
      return rst;
    },

    /**
     * \u8fc7\u6ee4\u6570\u7ec4
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){},\u5982\u679c\u8fd4\u56detrue\u5219\u6dfb\u52a0\u5230\u7ed3\u679c\u96c6
     * @return {Array} \u8fc7\u6ee4\u7684\u7ed3\u679c\u96c6
     */
    filter : function(array,func){
      var result = [];
      BUI.Array.each(array,function(value,index){
        if(func(value,index)){
          result.push(value);
        }
      });
      return result;
    },
    /**
     * \u8f6c\u6362\u6570\u7ec4\u6570\u7ec4
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){},\u5c06\u8fd4\u56de\u7684\u7ed3\u679c\u6dfb\u52a0\u5230\u7ed3\u679c\u96c6
     * @return {Array} \u8fc7\u6ee4\u7684\u7ed3\u679c\u96c6
     */
    map : function(array,func){
      var result = [];
      BUI.Array.each(array,function(value,index){
        result.push(func(value,index));
      });
      return result;
    },
    /**
     * \u83b7\u53d6\u7b2c\u4e00\u4e2a\u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e
     * @param  {Array} array \u6570\u7ec4
     * @param  {Function} func  \u5339\u914d\u51fd\u6570
     * @return {*}  \u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e
     */
    find : function(array,func){
      var i = BUI.Array.findIndex(array, func);
      return i < 0 ? null : array[i];
    },
    /**
     * \u83b7\u53d6\u7b2c\u4e00\u4e2a\u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e\u7684\u7d22\u5f15\u503c
    * @param  {Array} array \u6570\u7ec4
     * @param  {Function} func  \u5339\u914d\u51fd\u6570
     * @return {Number} \u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e\u7684\u7d22\u5f15\u503c
     */
    findIndex : function(array,func){
      var result = -1;
      BUI.Array.each(array,function(value,index){
        if(func(value,index)){
          result = index;
          return false;
        }
      });
      return result;
    },
    /**
     * \u6570\u7ec4\u662f\u5426\u4e3a\u7a7a
     * @param  {Array}  array \u6570\u7ec4
     * @return {Boolean}  \u662f\u5426\u4e3a\u7a7a
     */
    isEmpty : function(array){
      return array.length == 0;
    },
    /**
     * \u63d2\u5165\u6570\u7ec4
     * @param  {Array} array \u6570\u7ec4
     * @param  {Number} index \u4f4d\u7f6e
     * @param {*} value \u63d2\u5165\u7684\u6570\u636e
     */
    add : function(array,value){
      array.push(value);
    },
    /**
     * \u5c06\u6570\u636e\u63d2\u5165\u6570\u7ec4\u6307\u5b9a\u7684\u4f4d\u7f6e
     * @param  {Array} array \u6570\u7ec4
     * @param {*} value \u63d2\u5165\u7684\u6570\u636e
     * @param  {Number} index \u4f4d\u7f6e
     */
    addAt : function(array,value,index){
      BUI.Array.splice(array, index, 0, value);
    },
    /**
     * \u6e05\u7a7a\u6570\u7ec4
     * @param  {Array} array \u6570\u7ec4
     * @return {Array}  \u6e05\u7a7a\u540e\u7684\u6570\u7ec4
     */
    empty : function(array){
      if(!(array instanceof(Array))){
        for (var i = array.length - 1; i >= 0; i--) {
          delete array[i];
        }
      }
      array.length = 0;
    },
    /**
     * \u79fb\u9664\u8bb0\u5f55
     * @param  {Array} array \u6570\u7ec4
     * @param  {*} value \u8bb0\u5f55
     * @return {Boolean}   \u662f\u5426\u79fb\u9664\u6210\u529f
     */
    remove : function(array,value){
      var i = BUI.Array.indexOf(value, array);
      var rv;
      if ((rv = i >= 0)) {
        BUI.Array.removeAt(array, i);
      }
      return rv;
    },
    /**
     * \u79fb\u9664\u6307\u5b9a\u4f4d\u7f6e\u7684\u8bb0\u5f55
     * @param  {Array} array \u6570\u7ec4
     * @param  {Number} index \u7d22\u5f15\u503c
     * @return {Boolean}   \u662f\u5426\u79fb\u9664\u6210\u529f
     */
    removeAt : function(array,index){
      return BUI.Array.splice(array, index, 1).length == 1;
    },
    /**
     * @private
     */
    slice : function(arr, start, opt_end){
      if (arguments.length <= 2) {
        return Array.prototype.slice.call(arr, start);
      } else {
        return Array.prototype.slice.call(arr, start, opt_end);
      }
    },
    /**
     * @private
     */
    splice : function(arr, index, howMany, var_args){
      return Array.prototype.splice.apply(arr, BUI.Array.slice(arguments, 1))
    }

  };
  return BUI.Array;
});/**
 * @fileOverview \u89c2\u5bdf\u8005\u6a21\u5f0f\u5b9e\u73b0\u4e8b\u4ef6
 * @ignore
 */

define('bui/observable',['bui/util'],function (r) {
  
  var BUI = r('bui/util');
  /**
   * @private
   * @class BUI.Observable.Callbacks
   * jquery 1.7 \u65f6\u5b58\u5728 $.Callbacks,\u4f46\u662ffireWith\u7684\u8fd4\u56de\u7ed3\u679c\u662f$.Callbacks \u5bf9\u8c61\uff0c
   * \u800c\u6211\u4eec\u60f3\u8981\u7684\u6548\u679c\u662f\uff1a\u5f53\u5176\u4e2d\u6709\u4e00\u4e2a\u51fd\u6570\u8fd4\u56de\u4e3afalse\u65f6\uff0c\u963b\u6b62\u540e\u9762\u7684\u6267\u884c\uff0c\u5e76\u8fd4\u56defalse
   */
  var Callbacks = function(){
    this._init();
  };

  BUI.augment(Callbacks,{

    _functions : null,

    _init : function(){
      var _self = this;

      _self._functions = [];
    },
    /**
     * \u6dfb\u52a0\u56de\u8c03\u51fd\u6570
     * @param {Function} fn \u56de\u8c03\u51fd\u6570
     */
    add:function(fn){
      this._functions.push(fn);
    },
    /**
     * \u79fb\u9664\u56de\u8c03\u51fd\u6570
     * @param  {Function} fn \u56de\u8c03\u51fd\u6570
     */
    remove : function(fn){
      var functions = this._functions;
        index = BUI.Array.indexOf(fn,functions);
      if(index>=0){
        functions.splice(index,1);
      }
    },
    empty : function(){
      var length = this._functions.length; //ie6,7\u4e0b\uff0c\u5fc5\u987b\u6307\u5b9a\u9700\u8981\u5220\u9664\u7684\u6570\u91cf
      this._functions.splice(0,length);
    },
    /**
     * \u89e6\u53d1\u56de\u8c03
     * @param  {Object} scope \u4e0a\u4e0b\u6587
     * @param  {Array} args  \u56de\u8c03\u51fd\u6570\u7684\u53c2\u6570
     * @return {Boolean|undefined} \u5f53\u5176\u4e2d\u6709\u4e00\u4e2a\u51fd\u6570\u8fd4\u56de\u4e3afalse\u65f6\uff0c\u963b\u6b62\u540e\u9762\u7684\u6267\u884c\uff0c\u5e76\u8fd4\u56defalse
     */
    fireWith : function(scope,args){
      var _self = this,
        rst;

      BUI.each(_self._functions,function(fn){
        rst = fn.apply(scope,args);
        if(rst === false){
          return false;
        }
      });
      return rst;
    }
  });

  function getCallbacks(){
    return new Callbacks();
  }
  /**
   * \u652f\u6301\u4e8b\u4ef6\u7684\u5bf9\u8c61\uff0c\u53c2\u8003\u89c2\u5bdf\u8005\u6a21\u5f0f
   *  - \u6b64\u7c7b\u63d0\u4f9b\u4e8b\u4ef6\u7ed1\u5b9a
   *  - \u63d0\u4f9b\u4e8b\u4ef6\u5192\u6ce1\u673a\u5236
   *
   * <pre><code>
   *   var control = new Control();
   *   control.on('click',function(ev){
   *   
   *   });
   *
   *   control.off();  //\u79fb\u9664\u6240\u6709\u4e8b\u4ef6
   * </code></pre>
   * @class BUI.Observable
   * @abstract
   * @param {Object} config \u914d\u7f6e\u9879\u952e\u503c\u5bf9
   */
  var Observable = function(config){
        this._events = [];
        this._eventMap = {};
        this._bubblesEvents = [];
    this._initEvents(config);
  };

  BUI.augment(Observable,
  {

    /**
     * @cfg {Object} listeners 
     *  \u521d\u59cb\u5316\u4e8b\u4ef6,\u5feb\u901f\u6ce8\u518c\u4e8b\u4ef6
     *  <pre><code>
     *    var list = new BUI.List.SimpleList({
     *      listeners : {
     *        itemclick : function(ev){},
     *        itemrendered : function(ev){}
     *      },
     *      items : []
     *    });
     *    list.render();
     *  </code></pre>
     */
    
    /**
     * @cfg {Function} handler
     * \u70b9\u51fb\u4e8b\u4ef6\u7684\u5904\u7406\u51fd\u6570\uff0c\u5feb\u901f\u914d\u7f6e\u70b9\u51fb\u4e8b\u4ef6\u800c\u4e0d\u9700\u8981\u5199listeners\u5c5e\u6027
     * <pre><code>
     *    var list = new BUI.List.SimpleList({
     *      handler : function(ev){} //click \u4e8b\u4ef6
     *    });
     *    list.render();
     *  </code></pre>
     */
    
    /**
     * \u652f\u6301\u7684\u4e8b\u4ef6\u540d\u5217\u8868
     * @private
     */
    _events:[],

    /**
     * \u7ed1\u5b9a\u7684\u4e8b\u4ef6
     * @private
     */
    _eventMap : {},

    _bubblesEvents : [],

    _bubbleTarget : null,

    //\u83b7\u53d6\u56de\u8c03\u96c6\u5408
    _getCallbacks : function(eventType){
      var _self = this,
        eventMap = _self._eventMap;
      return eventMap[eventType];
    },
    //\u521d\u59cb\u5316\u4e8b\u4ef6\u5217\u8868
    _initEvents : function(config){
      var _self = this,
        listeners = null; 

      if(!config){
        return;
      }
      listeners = config.listeners || {};
      if(config.handler){
        listeners.click = config.handler;
      }
      if(listeners){
        for (var name in listeners) {
          if(listeners.hasOwnProperty(name)){
            _self.on(name,listeners[name]);
          }
        };
      }
    },
    //\u4e8b\u4ef6\u662f\u5426\u652f\u6301\u5192\u6ce1
    _isBubbles : function (eventType) {
        return BUI.Array.indexOf(eventType,this._bubblesEvents) >= 0;
    },
    /**
     * \u6dfb\u52a0\u5192\u6ce1\u7684\u5bf9\u8c61
     * @protected
     * @param {Object} target  \u5192\u6ce1\u7684\u4e8b\u4ef6\u6e90
     */
    addTarget : function(target) {
        this._bubbleTarget = target;
    },
    /**
     * \u6dfb\u52a0\u652f\u6301\u7684\u4e8b\u4ef6
     * @protected
     * @param {String|String[]} events \u4e8b\u4ef6
     */
    addEvents : function(events){
      var _self = this,
        existEvents = _self._events,
        eventMap = _self._eventMap;

      function addEvent(eventType){
        if(BUI.Array.indexOf(eventType,existEvents) === -1){
          eventMap[eventType] = getCallbacks();
          existEvents.push(eventType);
        }
      }
      if(BUI.isArray(events)){
        $.each(events,function(index,eventType){
          addEvent(eventType);
        });
      }else{
        addEvent(events);
      }
    },
    /**
     * \u79fb\u9664\u6240\u6709\u7ed1\u5b9a\u7684\u4e8b\u4ef6
     * @protected
     */
    clearListeners : function(){
      var _self = this,
        eventMap = _self._eventMap;
      for(var name in eventMap){
        if(eventMap.hasOwnProperty(name)){
          eventMap[name].empty();
        }
      }
    },
    /**
     * \u89e6\u53d1\u4e8b\u4ef6
     * <pre><code>
     *   //\u7ed1\u5b9a\u4e8b\u4ef6
     *   list.on('itemclick',function(ev){
     *     alert('21');
     *   });
     *   //\u89e6\u53d1\u4e8b\u4ef6
     *   list.fire('itemclick');
     * </code></pre>
     * @param  {String} eventType \u4e8b\u4ef6\u7c7b\u578b
     * @param  {Object} eventData \u4e8b\u4ef6\u89e6\u53d1\u65f6\u4f20\u9012\u7684\u6570\u636e
     * @return {Boolean|undefined}  \u5982\u679c\u5176\u4e2d\u4e00\u4e2a\u4e8b\u4ef6\u5904\u7406\u5668\u8fd4\u56de false , \u5219\u8fd4\u56de false, \u5426\u5219\u8fd4\u56de\u6700\u540e\u4e00\u4e2a\u4e8b\u4ef6\u5904\u7406\u5668\u7684\u8fd4\u56de\u503c
     */
    fire : function(eventType,eventData){
      var _self = this,
        callbacks = _self._getCallbacks(eventType),
        args = $.makeArray(arguments),
        result;
      if(!eventData){
        eventData = {};
        args.push(eventData);
      }
      if(!eventData.target){
        eventData.target = _self;
      }
      if(callbacks){
        result = callbacks.fireWith(_self,Array.prototype.slice.call(args,1));
      }
      if(_self._isBubbles(eventType)){
          var bubbleTarget = _self._bubbleTarget;
          if(bubbleTarget && bubbleTarget.fire){
              bubbleTarget.fire(eventType,eventData);
          }
      }
      return result;
    },
    /**
     * \u6dfb\u52a0\u7ed1\u5b9a\u4e8b\u4ef6
     * <pre><code>
     *   //\u7ed1\u5b9a\u5355\u4e2a\u4e8b\u4ef6
     *   list.on('itemclick',function(ev){
     *     alert('21');
     *   });
     *   //\u7ed1\u5b9a\u591a\u4e2a\u4e8b\u4ef6
     *   list.on('itemrendered itemupdated',function(){
     *     //\u5217\u8868\u9879\u521b\u5efa\u3001\u66f4\u65b0\u65f6\u89e6\u53d1\u64cd\u4f5c
     *   });
     * </code></pre>
     * @param  {String}   eventType \u4e8b\u4ef6\u7c7b\u578b
     * @param  {Function} fn        \u56de\u8c03\u51fd\u6570
     */
    on : function(eventType,fn){
      //\u4e00\u6b21\u76d1\u542c\u591a\u4e2a\u4e8b\u4ef6
      var arr = eventType.split(' '),
        _self = this,
        callbacks =null;
      if(arr.length > 1){
        BUI.each(arr,function(name){
          _self.on(name,fn);
        });
      }else{
        callbacks = _self._getCallbacks(eventType);
        if(callbacks){
          callbacks.add(fn);
        }else{
          _self.addEvents(eventType);
          _self.on(eventType,fn);
        }
      }
      return _self;
    },
    /**
     * \u79fb\u9664\u7ed1\u5b9a\u7684\u4e8b\u4ef6
     * <pre><code>
     *  //\u79fb\u9664\u6240\u6709\u4e8b\u4ef6
     *  list.off();
     *  
     *  //\u79fb\u9664\u7279\u5b9a\u4e8b\u4ef6
     *  function callback(ev){}
     *  list.on('click',callback);
     *
     *  list.off('click',callback);//\u9700\u8981\u4fdd\u5b58\u56de\u8c03\u51fd\u6570\u7684\u5f15\u7528
     * 
     * </code></pre>
     * @param  {String}   eventType \u4e8b\u4ef6\u7c7b\u578b
     * @param  {Function} fn        \u56de\u8c03\u51fd\u6570
     */
    off : function(eventType,fn){
      if(!eventType && !fn){
        this.clearListeners();
        return this;
      }
      var _self = this,
        callbacks = _self._getCallbacks(eventType);
      if(callbacks){
        callbacks.remove(fn);
      }
      return _self;
    },
    /**
     * \u914d\u7f6e\u4e8b\u4ef6\u662f\u5426\u5141\u8bb8\u5192\u6ce1
     * @protected
     * @param  {String} eventType \u652f\u6301\u5192\u6ce1\u7684\u4e8b\u4ef6
     * @param  {Object} cfg \u914d\u7f6e\u9879
     * @param {Boolean} cfg.bubbles \u662f\u5426\u652f\u6301\u5192\u6ce1
     */
    publish : function(eventType, cfg){
      var _self = this,
          bubblesEvents = _self._bubblesEvents;

      if(cfg.bubbles){
          if(BUI.Array.indexOf(eventType,bubblesEvents) === -1){
              bubblesEvents.push(eventType);
          }
      }else{
          var index = BUI.Array.indexOf(eventType,bubblesEvents);
          if(index !== -1){
              bubblesEvents.splice(index,1);
          }
      }
    }
  });

  return Observable;
});/**
 * @fileOverview UA,jQuery\u7684 $.browser \u5bf9\u8c61\u975e\u5e38\u96be\u4f7f\u7528
 * @ignore
 * @author dxq613@gmail.com
 */
define('bui/ua',function(){

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    };

    var UA = $.UA || (function(){
        var browser = $.browser,
            versionNumber = numberify(browser.version),
            /**
             * \u6d4f\u89c8\u5668\u7248\u672c\u68c0\u6d4b
             * @class BUI.UA
                     * @singleton
             */
            ua = 
            {
                /**
                 * ie \u7248\u672c
                 * @type {Number}
                 */
                ie : browser.msie && versionNumber,

                /**
                 * webkit \u7248\u672c
                 * @type {Number}
                 */
                webkit : browser.webkit && versionNumber,
                /**
                 * opera \u7248\u672c
                 * @type {Number}
                 */
                opera : browser.opera && versionNumber,
                /**
                 * mozilla \u706b\u72d0\u7248\u672c
                 * @type {Number}
                 */
                mozilla : browser.mozilla && versionNumber
            };
        return ua;
    })();

    return UA;
});/**
 * @fileOverview \u7531\u4e8ejQuery\u53ea\u6709 parseJSON \uff0c\u6ca1\u6709stringify\u6240\u4ee5\u4f7f\u7528\u8fc7\u7a0b\u4e0d\u65b9\u4fbf
 * @ignore
 */
define('bui/json',['bui/ua'],function (require) {

  var win = window,
    UA = require('bui/ua'),
    JSON = win.JSON;

  // ie 8.0.7600.16315@win7 json \u6709\u95ee\u9898
  if (!JSON || UA['ie'] < 9) {
      JSON = win.JSON = {};
  }

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {

      Date.prototype.toJSON = function (key) {

          return isFinite(this.valueOf()) ?
              this.getUTCFullYear() + '-' +
                  f(this.getUTCMonth() + 1) + '-' +
                  f(this.getUTCDate()) + 'T' +
                  f(this.getUTCHours()) + ':' +
                  f(this.getUTCMinutes()) + ':' +
                  f(this.getUTCSeconds()) + 'Z' : null;
      };

      String.prototype.toJSON =
          Number.prototype.toJSON =
              Boolean.prototype.toJSON = function (key) {
                  return this.valueOf();
              };
  }


  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

    function quote(string) {

      // If the string contains no control characters, no quote characters, and no
      // backslash characters, then we can safely slap some quotes around it.
      // Otherwise we must also replace the offending characters with safe escape
      // sequences.

      escapable['lastIndex'] = 0;
      return escapable.test(string) ?
          '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string' ? c :
                  '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' :
          '"' + string + '"';
    }

    function str(key, holder) {

      // Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

      // If the value has a toJSON method, call it to obtain a replacement value.

      if (value && typeof value === 'object' &&
          typeof value.toJSON === 'function') {
          value = value.toJSON(key);
      }

      // If we were called with a replacer function, then call the replacer to
      // obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

      // What happens next depends on the value's type.

      switch (typeof value) {
          case 'string':
              return quote(value);

          case 'number':

      // JSON numbers must be finite. Encode non-finite numbers as null.

              return isFinite(value) ? String(value) : 'null';

          case 'boolean':
          case 'null':

      // If the value is a boolean or null, convert it to a string. Note:
      // typeof null does not produce 'null'. The case is included here in
      // the remote chance that this gets fixed someday.

              return String(value);

      // If the type is 'object', we might be dealing with an object or an array or
      // null.

          case 'object':

      // Due to a specification blunder in ECMAScript, typeof null is 'object',
      // so watch out for that case.

              if (!value) {
                  return 'null';
              }

      // Make an array to hold the partial results of stringifying this object value.

              gap += indent;
              partial = [];

      // Is the value an array?

              if (Object.prototype.toString.apply(value) === '[object Array]') {

      // The value is an array. Stringify every element. Use null as a placeholder
      // for non-JSON values.

                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                      partial[i] = str(i, value) || 'null';
                  }

      // Join all of the elements together, separated with commas, and wrap them in
      // brackets.

                  v = partial.length === 0 ? '[]' :
                      gap ? '[\n' + gap +
                          partial.join(',\n' + gap) + '\n' +
                          mind + ']' :
                          '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
              }

      // If the replacer is an array, use it to select the members to be stringified.

              if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                      k = rep[i];
                      if (typeof k === 'string') {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              } else {

      // Otherwise, iterate through all of the keys in the object.

                  for (k in value) {
                      if (Object.hasOwnProperty.call(value, k)) {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              }

      // Join all of the member texts together, separated with commas,
      // and wrap them in braces.

              v = partial.length === 0 ? '{}' :
                  gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                      mind + '}' : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
      }
  }

  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

      // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
          (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.

      return str('', {'': value});
      };
    }

  function looseParse(data){
    try{
      return new Function('return ' + data + ';')();
    }catch(e){
      throw 'Json parse error!';
    }
  }
 /**
	* JSON \u683c\u5f0f\u5316
  * @class BUI.JSON
	* @singleton
  */
  var JSON = {
    /**
     * \u8f6c\u6210json \u7b49\u540c\u4e8e$.parseJSON
     * @method
     * @param {String} jsonstring \u5408\u6cd5\u7684json \u5b57\u7b26\u4e32
     */
    parse : $.parseJSON,
    /**
     * \u4e1a\u52a1\u4e2d\u6709\u4e9b\u5b57\u7b26\u4e32\u7ec4\u6210\u7684json\u6570\u636e\u4e0d\u662f\u4e25\u683c\u7684json\u6570\u636e\uff0c\u5982\u4f7f\u7528\u5355\u5f15\u53f7\uff0c\u6216\u8005\u5c5e\u6027\u540d\u4e0d\u662f\u5b57\u7b26\u4e32
     * \u5982 \uff1a {a:'abc'}
     * @method 
     * @param {String} jsonstring
     */
    looseParse : looseParse,
    /**
     * \u5c06Json\u8f6c\u6210\u5b57\u7b26\u4e32
     * @method 
     * @param {Object} json json \u5bf9\u8c61
     */
    stringify : JSON.stringify
  }

  return JSON;
});/**
 * @fileOverview \u952e\u76d8\u503c
 * @ignore
 */

define('bui/keycode',function () {
  
  /**
   * \u952e\u76d8\u6309\u952e\u5bf9\u5e94\u7684\u6570\u5b57\u503c
   * @class BUI.KeyCode
   * @singleton
   */
  var keyCode = {
    /** Key constant @type Number */
    BACKSPACE: 8,
    /** Key constant @type Number */
    TAB: 9,
    /** Key constant @type Number */
    NUM_CENTER: 12,
    /** Key constant @type Number */
    ENTER: 13,
    /** Key constant @type Number */
    RETURN: 13,
    /** Key constant @type Number */
    SHIFT: 16,
    /** Key constant @type Number */
    CTRL: 17,
    /** Key constant @type Number */
    ALT: 18,
    /** Key constant @type Number */
    PAUSE: 19,
    /** Key constant @type Number */
    CAPS_LOCK: 20,
    /** Key constant @type Number */
    ESC: 27,
    /** Key constant @type Number */
    SPACE: 32,
    /** Key constant @type Number */
    PAGE_UP: 33,
    /** Key constant @type Number */
    PAGE_DOWN: 34,
    /** Key constant @type Number */
    END: 35,
    /** Key constant @type Number */
    HOME: 36,
    /** Key constant @type Number */
    LEFT: 37,
    /** Key constant @type Number */
    UP: 38,
    /** Key constant @type Number */
    RIGHT: 39,
    /** Key constant @type Number */
    DOWN: 40,
    /** Key constant @type Number */
    PRINT_SCREEN: 44,
    /** Key constant @type Number */
    INSERT: 45,
    /** Key constant @type Number */
    DELETE: 46,
    /** Key constant @type Number */
    ZERO: 48,
    /** Key constant @type Number */
    ONE: 49,
    /** Key constant @type Number */
    TWO: 50,
    /** Key constant @type Number */
    THREE: 51,
    /** Key constant @type Number */
    FOUR: 52,
    /** Key constant @type Number */
    FIVE: 53,
    /** Key constant @type Number */
    SIX: 54,
    /** Key constant @type Number */
    SEVEN: 55,
    /** Key constant @type Number */
    EIGHT: 56,
    /** Key constant @type Number */
    NINE: 57,
    /** Key constant @type Number */
    A: 65,
    /** Key constant @type Number */
    B: 66,
    /** Key constant @type Number */
    C: 67,
    /** Key constant @type Number */
    D: 68,
    /** Key constant @type Number */
    E: 69,
    /** Key constant @type Number */
    F: 70,
    /** Key constant @type Number */
    G: 71,
    /** Key constant @type Number */
    H: 72,
    /** Key constant @type Number */
    I: 73,
    /** Key constant @type Number */
    J: 74,
    /** Key constant @type Number */
    K: 75,
    /** Key constant @type Number */
    L: 76,
    /** Key constant @type Number */
    M: 77,
    /** Key constant @type Number */
    N: 78,
    /** Key constant @type Number */
    O: 79,
    /** Key constant @type Number */
    P: 80,
    /** Key constant @type Number */
    Q: 81,
    /** Key constant @type Number */
    R: 82,
    /** Key constant @type Number */
    S: 83,
    /** Key constant @type Number */
    T: 84,
    /** Key constant @type Number */
    U: 85,
    /** Key constant @type Number */
    V: 86,
    /** Key constant @type Number */
    W: 87,
    /** Key constant @type Number */
    X: 88,
    /** Key constant @type Number */
    Y: 89,
    /** Key constant @type Number */
    Z: 90,
    /** Key constant @type Number */
    CONTEXT_MENU: 93,
    /** Key constant @type Number */
    NUM_ZERO: 96,
    /** Key constant @type Number */
    NUM_ONE: 97,
    /** Key constant @type Number */
    NUM_TWO: 98,
    /** Key constant @type Number */
    NUM_THREE: 99,
    /** Key constant @type Number */
    NUM_FOUR: 100,
    /** Key constant @type Number */
    NUM_FIVE: 101,
    /** Key constant @type Number */
    NUM_SIX: 102,
    /** Key constant @type Number */
    NUM_SEVEN: 103,
    /** Key constant @type Number */
    NUM_EIGHT: 104,
    /** Key constant @type Number */
    NUM_NINE: 105,
    /** Key constant @type Number */
    NUM_MULTIPLY: 106,
    /** Key constant @type Number */
    NUM_PLUS: 107,
    /** Key constant @type Number */
    NUM_MINUS: 109,
    /** Key constant @type Number */
    NUM_PERIOD: 110,
    /** Key constant @type Number */
    NUM_DIVISION: 111,
    /** Key constant @type Number */
    F1: 112,
    /** Key constant @type Number */
    F2: 113,
    /** Key constant @type Number */
    F3: 114,
    /** Key constant @type Number */
    F4: 115,
    /** Key constant @type Number */
    F5: 116,
    /** Key constant @type Number */
    F6: 117,
    /** Key constant @type Number */
    F7: 118,
    /** Key constant @type Number */
    F8: 119,
    /** Key constant @type Number */
    F9: 120,
    /** Key constant @type Number */
    F10: 121,
    /** Key constant @type Number */
    F11: 122,
    /** Key constant @type Number */
    F12: 123
  };

  return keyCode;
});/*
 * @fileOverview Date Format 1.2.3
 * @ignore
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 *
 * Last modified by jayli \u62d4\u8d64 2010-09-09
 * - \u589e\u52a0\u4e2d\u6587\u7684\u652f\u6301
 * - \u7b80\u5355\u7684\u672c\u5730\u5316\uff0c\u5bf9w\uff08\u661f\u671fx\uff09\u7684\u652f\u6301
 * 
 */
define('bui/date',function () {

    var dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;
    function dateParse(data, s) {

        var date = null;
        s = s || '-';
        //Convert to date
        if (!(date instanceof Date)) {
            if(BUI.isString(data)){
                date = new Date(data.replace(/-/g,'/'));
            }else{
                date = new Date(data);
            }
            
        }
        else {
            return date;
        }

        // Validate
        if (date instanceof Date && (date != 'Invalid Date') && !isNaN(date)) {
            return date;
        }
        else {
            var arr = data.toString().split(s);
            if (arr.length == 3) {
                date = new Date(arr[0], (parseInt(arr[1], 10) - 1), arr[2]);
                if (date instanceof Date && (date != 'Invalid Date') && !isNaN(date)) {
                    return date;
                }
            }
        }
        return null;

    }

    function   DateAdd(strInterval,   NumDay,   dtDate)   {   
        var   dtTmp   =   new   Date(dtDate);   
        if   (isNaN(dtTmp)){
            dtTmp   =   new   Date(); 
        }     
        switch   (strInterval)   {   
           case   's':
             dtTmp =   new   Date(dtTmp.getTime()   +   (1000   *   parseInt(NumDay))); 
             break; 
           case   'n':
             dtTmp =   new   Date(dtTmp.getTime()   +   (60000   *   parseInt(NumDay))); 
             break; 
           case   'h':
             dtTmp =   new   Date(dtTmp.getTime()   +   (3600000   *   parseInt(NumDay)));
             break;
           case   'd':
             dtTmp =   new   Date(dtTmp.getTime()   +   (86400000   *   parseInt(NumDay)));
             break;
           case   'w':
             dtTmp =   new   Date(dtTmp.getTime()   +   ((86400000   *   7)   *   parseInt(NumDay))); 
             break;
           case   'm':
             dtTmp =   new   Date(dtTmp.getFullYear(),   (dtTmp.getMonth())+parseInt(NumDay),   dtTmp.getDate(),   dtTmp.getHours(),   dtTmp.getMinutes(),   dtTmp.getSeconds());
             break;   
           case   'y':
             //alert(dtTmp.getFullYear());
             dtTmp =   new   Date(dtTmp.getFullYear()+parseInt(NumDay),   dtTmp.getMonth(),   dtTmp.getDate(),   dtTmp.getHours(),   dtTmp.getMinutes(),   dtTmp.getSeconds());
             //alert(dtTmp);
             break;
        }
        return dtTmp;
    }   

    var dateFormat = function () {
        var token = /w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = '0' + val;
                }
                return val;
            },
            // Some common format strings
            masks = {
                'default':'ddd mmm dd yyyy HH:MM:ss',
                shortDate:'m/d/yy',
                //mediumDate:     'mmm d, yyyy',
                longDate:'mmmm d, yyyy',
                fullDate:'dddd, mmmm d, yyyy',
                shortTime:'h:MM TT',
                //mediumTime:     'h:MM:ss TT',
                longTime:'h:MM:ss TT Z',
                isoDate:'yyyy-mm-dd',
                isoTime:'HH:MM:ss',
                isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",
                isoUTCDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",

                //added by jayli
                localShortDate:'yy\u5e74mm\u6708dd\u65e5',
                localShortDateTime:'yy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT',
                localLongDate:'yyyy\u5e74mm\u6708dd\u65e5',
                localLongDateTime:'yyyy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT',
                localFullDate:'yyyy\u5e74mm\u6708dd\u65e5 w',
                localFullDateTime:'yyyy\u5e74mm\u6708dd\u65e5 w hh:MM:ss TT'

            },

            // Internationalization strings
            i18n = {
                dayNames:[
                    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
                    '\u661f\u671f\u65e5', '\u661f\u671f\u4e00', '\u661f\u671f\u4e8c', '\u661f\u671f\u4e09', '\u661f\u671f\u56db', '\u661f\u671f\u4e94', '\u661f\u671f\u516d'
                ],
                monthNames:[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ]
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                throw SyntaxError('invalid date');
            }

            mask = String(masks[mask] || mask || masks['default']);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) === 'UTC:') {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? 'getUTC' : 'get',
                d = date[_ + 'Date'](),
                D = date[_ + 'Day'](),
                m = date[_ + 'Month'](),
                y = date[_ + 'FullYear'](),
                H = date[_ + 'Hours'](),
                M = date[_ + 'Minutes'](),
                s = date[_ + 'Seconds'](),
                L = date[_ + 'Milliseconds'](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:d,
                    dd:pad(d, undefined),
                    ddd:i18n.dayNames[D],
                    dddd:i18n.dayNames[D + 7],
                    w:i18n.dayNames[D + 14],
                    m:m + 1,
                    mm:pad(m + 1, undefined),
                    mmm:i18n.monthNames[m],
                    mmmm:i18n.monthNames[m + 12],
                    yy:String(y).slice(2),
                    yyyy:y,
                    h:H % 12 || 12,
                    hh:pad(H % 12 || 12, undefined),
                    H:H,
                    HH:pad(H, undefined),
                    M:M,
                    MM:pad(M, undefined),
                    s:s,
                    ss:pad(s, undefined),
                    l:pad(L, 3),
                    L:pad(L > 99 ? Math.round(L / 10) : L, undefined),
                    t:H < 12 ? 'a' : 'p',
                    tt:H < 12 ? 'am' : 'pm',
                    T:H < 12 ? 'A' : 'P',
                    TT:H < 12 ? 'AM' : 'PM',
                    Z:utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                    o:(o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

	/**
	* \u65e5\u671f\u7684\u5de5\u5177\u65b9\u6cd5
	* @class BUI.Date
	*/
    var DateUtil = {
        /**
         * \u65e5\u671f\u52a0\u6cd5
         * @param {String} strInterval \u52a0\u6cd5\u7684\u7c7b\u578b\uff0cs(\u79d2),n(\u5206),h(\u65f6),d(\u5929),w(\u5468),m(\u6708),y(\u5e74)
         * @param {Number} Num         \u6570\u91cf\uff0c\u5982\u679c\u4e3a\u8d1f\u6570\uff0c\u5219\u4e3a\u51cf\u6cd5
         * @param {Date} dtDate      \u8d77\u59cb\u65e5\u671f\uff0c\u9ed8\u8ba4\u4e3a\u6b64\u65f6
         */
        add : function(strInterval,Num,dtDate){
            return DateAdd(strInterval,Num,dtDate);
        },
        /**
         * \u5c0f\u65f6\u7684\u52a0\u6cd5
         * @param {Number} hours \u5c0f\u65f6
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addHour : function(hours,date){
            return DateAdd('h',hours,date);
        },
         /**
         * \u5206\u7684\u52a0\u6cd5
         * @param {Number} minutes \u5206
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addMinute : function(minutes,date){
            return DateAdd('n',minutes,date);
        },
         /**
         * \u79d2\u7684\u52a0\u6cd5
         * @param {Number} seconds \u79d2
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addSecond : function(seconds,date){
            return DateAdd('s',seconds,date);
        },
        /**
         * \u5929\u7684\u52a0\u6cd5
         * @param {Number} days \u5929\u6570
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addDay : function(days,date){ 
            return DateAdd('d',days,date);
        },
        /**
         * \u589e\u52a0\u5468
         * @param {Number} weeks \u5468\u6570
         * @param {Date} date  \u8d77\u59cb\u65e5\u671f
         */
        addWeek : function(weeks,date){
            return DateAdd('w',weeks,date);
        },
        /**
         * \u589e\u52a0\u6708
         * @param {Number} months \u6708\u6570
         * @param {Date} date  \u8d77\u59cb\u65e5\u671f
         */
        addMonths : function(months,date){
            return DateAdd('m',months,date);
        },
        /**
         * \u589e\u52a0\u5e74
         * @param {Number} years \u5e74\u6570
         * @param {Date} date  \u8d77\u59cb\u65e5\u671f
         */
        addYear : function(years,date){
            return DateAdd('y',years,date);
        },
        /**
         * \u65e5\u671f\u662f\u5426\u76f8\u7b49\uff0c\u5ffd\u7565\u65f6\u95f4
         * @param  {Date}  d1 \u65e5\u671f\u5bf9\u8c61
         * @param  {Date}  d2 \u65e5\u671f\u5bf9\u8c61
         * @return {Boolean}    \u662f\u5426\u76f8\u7b49
         */
        isDateEquals : function(d1,d2){

            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        },
        /**
         * \u65e5\u671f\u65f6\u95f4\u662f\u5426\u76f8\u7b49\uff0c\u5305\u542b\u65f6\u95f4
         * @param  {Date}  d1 \u65e5\u671f\u5bf9\u8c61
         * @param  {Date}  d2 \u65e5\u671f\u5bf9\u8c61
         * @return {Boolean}    \u662f\u5426\u76f8\u7b49
         */
        isEquals : function (d1,d2) {
            if(d1 == d2){
                return true;
            }
            if(!d1 || !d2){
                return false;
            }
            if(!d1.getTime || !d2.getTime){
                return false;
            }
            return d1.getTime() == d2.getTime();
        },
        /**
         * \u5b57\u7b26\u4e32\u662f\u5426\u662f\u6709\u6548\u7684\u65e5\u671f\u7c7b\u578b
         * @param {String} str \u5b57\u7b26\u4e32
         * @return \u5b57\u7b26\u4e32\u662f\u5426\u80fd\u8f6c\u6362\u6210\u65e5\u671f
         */
        isDateString : function(str){
            return dateRegex.test(str);
        },
        /**
         * \u5c06\u65e5\u671f\u683c\u5f0f\u5316\u6210\u5b57\u7b26\u4e32
         * @param  {Date} date \u65e5\u671f
         * @param  {String} mask \u683c\u5f0f\u5316\u65b9\u5f0f
         * @param  {Date} utc  \u662f\u5426utc\u65f6\u95f4
         * @return {String}      \u65e5\u671f\u7684\u5b57\u7b26\u4e32
         */
        format:function (date, mask, utc) {
            return dateFormat(date, mask, utc);
        },
        /**
         * \u8f6c\u6362\u6210\u65e5\u671f
         * @param  {String|Date} date \u5b57\u7b26\u4e32\u6216\u8005\u65e5\u671f
         * @param  {String} s    \u65f6\u95f4\u7684\u5206\u5272\u7b26\uff0c\u5982 2001-01-01\u4e2d\u7684 '-'
         * @return {Date}      \u65e5\u671f\u5bf9\u8c61
         */
        parse:function (date, s) {
            return dateParse(date, s);
        },
        /**
         * \u5f53\u524d\u5929
         * @return {Date} \u5f53\u524d\u5929 00:00:00
         */
        today : function(){
            var now = new Date();
            return new Date(now.getFullYear(),now.getMonth(),now.getDate());
        },
        /**
         * \u8fd4\u56de\u5f53\u524d\u65e5\u671f
         * @return {Date} \u65e5\u671f\u7684 00:00:00
         */
        getDate : function(date){
            return new Date(date.getFullYear(),date.getMonth(),date.getDate());
        }
    };

    return DateUtil;
});/**
 * @fileOverview  Base UI\u63a7\u4ef6\u7684\u6700\u57fa\u7840\u7684\u7c7b
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */
define('bui/base',['bui/observable'],function(require){

  var INVALID = {},
    Observable = require('bui/observable');

  function ensureNonEmpty(obj, name, create) {
        var ret = obj[name] || {};
        if (create) {
            obj[name] = ret;
        }
        return ret;
  }

  function normalFn(host, method) {
      if (BUI.isString(method)) {
          return host[method];
      }
      return method;
  }

  function __fireAttrChange(self, when, name, prevVal, newVal) {
      var attrName = name;
      return self.fire(when + BUI.ucfirst(name) + 'Change', {
          attrName: attrName,
          prevVal: prevVal,
          newVal: newVal
      });
  }

  function setInternal(self, name, value, opts, attrs) {
      opts = opts || {};

      var ret,
          subVal,
          prevVal;

      prevVal = self.get(name);

      //\u5982\u679c\u672a\u6539\u53d8\u503c\u4e0d\u8fdb\u884c\u4fee\u6539
      if(!$.isPlainObject(value) && !BUI.isArray(value) && prevVal === value){
        return undefined;
      }
      // check before event
      if (!opts['silent']) {
          if (false === __fireAttrChange(self, 'before', name, prevVal, value)) {
              return false;
          }
      }
      // set it
      ret = self._set(name, value, opts);

      if (ret === false) {
          return ret;
      }

      // fire after event
      if (!opts['silent']) {
          value = self.getAttrVals()[name];
          __fireAttrChange(self, 'after', name, prevVal, value);
      }
      return self;
  }

  /**
   * \u57fa\u7840\u7c7b\uff0c\u6b64\u7c7b\u63d0\u4f9b\u4ee5\u4e0b\u529f\u80fd
   *  - \u63d0\u4f9b\u8bbe\u7f6e\u83b7\u53d6\u5c5e\u6027
   *  - \u63d0\u4f9b\u4e8b\u4ef6\u652f\u6301
   *  - \u5c5e\u6027\u53d8\u5316\u65f6\u4f1a\u89e6\u53d1\u5bf9\u5e94\u7684\u4e8b\u4ef6
   *  - \u5c06\u914d\u7f6e\u9879\u81ea\u52a8\u8f6c\u6362\u6210\u5c5e\u6027
   *
   * ** \u521b\u5efa\u7c7b\uff0c\u7ee7\u627fBUI.Base\u7c7b **
   * <pre><code>
   *   var Control = function(cfg){
   *     Control.superclass.constructor.call(this,cfg); //\u8c03\u7528BUI.Base\u7684\u6784\u9020\u65b9\u6cd5\uff0c\u5c06\u914d\u7f6e\u9879\u53d8\u6210\u5c5e\u6027
   *   };
   *
   *   BUI.extend(Control,BUI.Base);
   * </code></pre>
   *
   * ** \u58f0\u660e\u9ed8\u8ba4\u5c5e\u6027 ** 
   * <pre><code>
   *   Control.ATTRS = {
   *     id : {
   *       value : 'id' //value \u662f\u6b64\u5c5e\u6027\u7684\u9ed8\u8ba4\u503c
   *     },
   *     renderTo : {
   *      
   *     },
   *     el : {
   *       valueFn : function(){                 //\u7b2c\u4e00\u6b21\u8c03\u7528\u7684\u65f6\u5019\u5c06renderTo\u7684DOM\u8f6c\u6362\u6210el\u5c5e\u6027
   *         return $(this.get('renderTo'));
   *       }
   *     },
   *     text : {
   *       getter : function(){ //getter \u7528\u4e8e\u83b7\u53d6\u503c\uff0c\u800c\u4e0d\u662f\u8bbe\u7f6e\u7684\u503c
   *         return this.get('el').val();
   *       },
   *       setter : function(v){ //\u4e0d\u4ec5\u4ec5\u662f\u8bbe\u7f6e\u503c\uff0c\u53ef\u4ee5\u8fdb\u884c\u76f8\u5e94\u7684\u64cd\u4f5c
   *         this.get('el').val(v);
   *       }
   *     }
   *   };
   * </code></pre>
   *
   * ** \u58f0\u660e\u7c7b\u7684\u65b9\u6cd5 ** 
   * <pre><code>
   *   BUI.augment(Control,{
   *     getText : function(){
   *       return this.get('text');   //\u53ef\u4ee5\u7528get\u65b9\u6cd5\u83b7\u53d6\u5c5e\u6027\u503c
   *     },
   *     setText : function(txt){
   *       this.set('text',txt);      //\u4f7f\u7528set \u8bbe\u7f6e\u5c5e\u6027\u503c
   *     }
   *   });
   * </code></pre>
   *
   * ** \u521b\u5efa\u5bf9\u8c61 ** 
   * <pre><code>
   *   var c = new Control({
   *     id : 'oldId',
   *     text : '\u6d4b\u8bd5\u6587\u672c',
   *     renderTo : '#t1'
   *   });
   *
   *   var el = c.get(el); //$(#t1);
   *   el.val(); //text\u7684\u503c \uff1a '\u6d4b\u8bd5\u6587\u672c'
   *   c.set('text','\u4fee\u6539\u7684\u503c');
   *   el.val();  //'\u4fee\u6539\u7684\u503c'
   *
   *   c.set('id','newId') //\u4f1a\u89e6\u53d12\u4e2a\u4e8b\u4ef6\uff1a beforeIdChange,afterIdChange 2\u4e2a\u4e8b\u4ef6 ev.newVal \u548cev.prevVal\u6807\u793a\u65b0\u65e7\u503c
   * </code></pre>
   * @class BUI.Base
   * @abstract
   * @extends BUI.Observable
   * @param {Object} config \u914d\u7f6e\u9879
   */
  var Base = function(config){
    var _self = this,
            c = _self.constructor,
            constructors = [];

        Observable.apply(this,arguments);
        // define
        while (c) {
            constructors.push(c);
            //_self.addAttrs(c['ATTRS']);
            c = c.superclass ? c.superclass.constructor : null;
        }
        //\u4ee5\u5f53\u524d\u5bf9\u8c61\u7684\u5c5e\u6027\u6700\u7ec8\u6dfb\u52a0\u5230\u5c5e\u6027\u4e2d\uff0c\u8986\u76d6\u4e4b\u524d\u7684\u5c5e\u6027
        for (var i = constructors.length - 1; i >= 0; i--) {
          _self.addAttrs(constructors[i]['ATTRS'],true);
        };
        _self._initAttrs(config);

  };

  Base.INVALID = INVALID;

  BUI.extend(Base,Observable);

  BUI.augment(Base,
  {
    /**
     * \u6dfb\u52a0\u5c5e\u6027\u5b9a\u4e49
     * @protected
     * @param {String} name       \u5c5e\u6027\u540d
     * @param {Object} attrConfig \u5c5e\u6027\u5b9a\u4e49
     * @param {Boolean} overrides \u662f\u5426\u8986\u76d6\u5b57\u6bb5
     */
    addAttr: function (name, attrConfig,overrides) {
            var _self = this,
                attrs = _self.getAttrs(),
                cfg = BUI.cloneObject(attrConfig);//;//$.clone(attrConfig);

            if (!attrs[name]) {
                attrs[name] = cfg;
            } else if(overrides){
                BUI.mix(true,attrs[name], cfg);
            }
            return _self;
    },
    /**
     * \u6dfb\u52a0\u5c5e\u6027\u5b9a\u4e49
     * @protected
     * @param {Object} attrConfigs  An object with attribute name/configuration pairs.
     * @param {Object} initialValues user defined initial values
     * @param {Boolean} overrides \u662f\u5426\u8986\u76d6\u5b57\u6bb5
     */
    addAttrs: function (attrConfigs, initialValues,overrides) {
        var _self = this;
        if(!attrConfigs)
        {
          return _self;
        }
        if(typeof(initialValues) === 'boolean'){
          overrides = initialValues;
          initialValues = null;
        }
        BUI.each(attrConfigs, function (attrConfig, name) {
            _self.addAttr(name, attrConfig,overrides);
        });
        if (initialValues) {
            _self.set(initialValues);
        }
        return _self;
    },
    /**
     * \u662f\u5426\u5305\u542b\u6b64\u5c5e\u6027
     * @protected
     * @param  {String}  name \u503c
     * @return {Boolean} \u662f\u5426\u5305\u542b
     */
    hasAttr : function(name){
      return name && this.getAttrs().hasOwnProperty(name);
    },
    /**
     * \u83b7\u53d6\u9ed8\u8ba4\u7684\u5c5e\u6027\u503c
     * @protected
     * @return {Object} \u5c5e\u6027\u503c\u7684\u952e\u503c\u5bf9
     */
    getAttrs : function(){
       return ensureNonEmpty(this, '__attrs', true);
    },
    /**
     * \u83b7\u53d6\u5c5e\u6027\u540d/\u5c5e\u6027\u503c\u952e\u503c\u5bf9
     * @protected
     * @return {Object} \u5c5e\u6027\u5bf9\u8c61
     */
    getAttrVals: function(){
      return ensureNonEmpty(this, '__attrVals', true);
    },
    /**
     * \u83b7\u53d6\u5c5e\u6027\u503c\uff0c\u6240\u6709\u7684\u914d\u7f6e\u9879\u548c\u5c5e\u6027\u90fd\u53ef\u4ee5\u901a\u8fc7get\u65b9\u6cd5\u83b7\u53d6
     * <pre><code>
     *  var control = new Control({
     *   text : 'control text'
     *  });
     *  control.get('text'); //control text
     *
     *  control.set('customValue','value'); //\u4e34\u65f6\u53d8\u91cf
     *  control.get('customValue'); //value
     * </code></pre>
     * ** \u5c5e\u6027\u503c/\u914d\u7f6e\u9879 **
     * <pre><code> 
     *   Control.ATTRS = { //\u58f0\u660e\u5c5e\u6027\u503c
     *     text : {
     *       valueFn : function(){},
     *       value : 'value',
     *       getter : function(v){} 
     *     }
     *   };
     *   var c = new Control({
     *     text : 'text value'
     *   });
     *   //get \u51fd\u6570\u53d6\u7684\u987a\u5e8f\u4e3a\uff1a\u662f\u5426\u6709\u4fee\u6539\u503c\uff08\u914d\u7f6e\u9879\u3001set)\u3001\u9ed8\u8ba4\u503c\uff08\u7b2c\u4e00\u6b21\u8c03\u7528\u6267\u884cvalueFn)\uff0c\u5982\u679c\u6709getter\uff0c\u5219\u5c06\u503c\u4f20\u5165getter\u8fd4\u56de
     *
     *   c.get('text') //text value
     *   c.set('text','new text');//\u4fee\u6539\u503c
     *   c.get('text');//new text
     * </code></pre>
     * @param  {String} name \u5c5e\u6027\u540d
     * @return {Object} \u5c5e\u6027\u503c
     */
    get : function(name){
      var _self = this,
                declared = _self.hasAttr(name),
                attrVals = _self.getAttrVals(),
                attrConfig,
                getter, 
                ret;

            attrConfig = ensureNonEmpty(_self.getAttrs(), name);
            getter = attrConfig['getter'];

            // get user-set value or default value
            //user-set value takes privilege
            ret = name in attrVals ?
                attrVals[name] :
                _self._getDefAttrVal(name);

            // invoke getter for this attribute
            if (getter && (getter = normalFn(_self, getter))) {
                ret = getter.call(_self, ret, name);
            }

            return ret;
    },
  	/**
  	* @\u6e05\u7406\u6240\u6709\u5c5e\u6027\u503c
    * @protected 
  	*/
  	clearAttrVals : function(){
  		this.__attrVals = {};
  	},
    /**
     * \u79fb\u9664\u5c5e\u6027\u5b9a\u4e49
     * @protected
     */
    removeAttr: function (name) {
        var _self = this;

        if (_self.hasAttr(name)) {
            delete _self.getAttrs()[name];
            delete _self.getAttrVals()[name];
        }

        return _self;
    },
    /**
     * \u8bbe\u7f6e\u5c5e\u6027\u503c\uff0c\u4f1a\u89e6\u53d1before+Name+Change,\u548c after+Name+Change\u4e8b\u4ef6
     * <pre><code>
     *  control.on('beforeTextChange',function(ev){
     *    var newVal = ev.newVal,
     *      attrName = ev.attrName,
     *      preVal = ev.prevVal;
     *
     *    //TO DO
     *  });
     *  control.set('text','new text');  //\u6b64\u65f6\u89e6\u53d1 beforeTextChange,afterTextChange
     *  control.set('text','modify text',{silent : true}); //\u6b64\u65f6\u4e0d\u89e6\u53d1\u4e8b\u4ef6
     * </code></pre>
     * @param {String|Object} name  \u5c5e\u6027\u540d
     * @param {Object} value \u503c
     * @param {Object} opts \u914d\u7f6e\u9879
     * @param {Boolean} opts.silent  \u914d\u7f6e\u5c5e\u6027\u65f6\uff0c\u662f\u5426\u4e0d\u89e6\u53d1\u4e8b\u4ef6
     */
    set : function(name,value,opts){
      var _self = this;
            if ($.isPlainObject(name)) {
                opts = value;
                var all = Object(name),
                    attrs = [];
                   
                for (name in all) {
                    if (all.hasOwnProperty(name)) {
                        setInternal(_self, name, all[name], opts);
                    }
             