/**
 * doc
 * v1.0.0
 * built: Tue, 22 Nov 2016 06:51:38 GMT
 * git: https://github.com/ndaidong/doc
 * author: @ndaidong
 * License: MIT
**/

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (name, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    var root = window || {};
    if (root.define && root.define.amd) {
      root.define([], factory);
    } else if (root.exports) {
      root.exports = factory();
    } else {
      root[name] = factory();
    }
  }
})('doc', function () {

  var isUndefined = function isUndefined(v) {
    return v === undefined;
  };
  var isObject = function isObject(v) {
    return !isUndefined(v) && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object';
  };
  var isString = function isString(v) {
    return typeof v === 'string';
  };
  var isNumber = function isNumber(v) {
    return typeof v === 'number';
  };
  var isElement = function isElement(v) {
    return v instanceof HTMLElement;
  };
  var isFunction = function isFunction(v) {
    return v && {}.toString.call(v) === '[object Function]';
  };

  var trim = function trim(s, all) {
    if (!isString(s)) {
      return '';
    }
    var x = s ? s.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '') : s || '';
    if (x && all) {
      return x.replace(/\r?\n|\r/g, ' ').replace(/\s\s+|\r/g, ' ');
    }
    return x;
  };

  var normalize = function normalize(k, v) {

    var reg = /^([a-z]+)([A-Z]{1})([a-z]+)$/;
    var mat = k.match(reg);
    if (mat && mat.index === 0) {
      var a = [];
      a.push(mat[1]);
      a.push('-');
      a.push(mat[2]);
      a.push(mat[3]);
      k = a.join('').toLowerCase();
    }

    if (isNumber(v)) {
      v += 'px';
    }

    return {
      key: k,
      value: v
    };
  };

  var add, create, get, query, queryAll;

  var nav = navigator;
  var win = window;
  var doc = document;

  get = function get(el) {
    var p = (isString(el) ? doc.getElementById(el) : el) || null;
    if (p && isElement(p)) {
      (function () {

        var pc = p.classList;

        p.hasClass = function (c) {
          c = trim(c, true);
          if (!c) {
            return false;
          }
          return pc.contains(c);
        };

        p.addClass = function (c) {
          c = trim(c, true);
          if (!c) {
            return false;
          }
          var a = c.split(' ');
          if (a.length > 1) {
            a.forEach(function (s) {
              pc.add(s);
            });
          } else {
            pc.add(c);
          }
          return p;
        };

        p.removeClass = function (c) {
          c = trim(c, true);
          if (!c) {
            return false;
          }
          var a = c.split(' ');
          if (a.length > 1) {
            a.forEach(function (s) {
              pc.remove(s);
            });
          } else {
            pc.remove(c);
          }
          return p;
        };

        p.toggleClass = function (c) {
          c = trim(c, true);
          if (!c) {
            return false;
          }
          var a = c.split(' ');
          if (a.length > 1) {
            a.forEach(function (s) {
              pc.toggle(s);
            });
          } else {
            pc.toggle(c);
          }
          return p;
        };

        p.setProperty = function (o) {
          for (var k in o) {
            if (o[k] !== '') {
              var v = o[k];
              if (isString(v) || isNumber(v)) {
                p.setAttribute(k, v);
              }
            }
          }
          return p;
        };

        p.setStyle = function (o) {
          var a = [];
          if (isObject(o)) {
            for (var k in o) {
              if (o[k] !== '') {
                var v = o[k];
                if (isString(v) || isNumber(v)) {
                  var x = normalize(k, v);
                  a.push([x.key, x.value].join(':'));
                }
              }
            }
          } else if (isString(o)) {
            a = o.split(';');
          }
          var s = p.getAttribute('style');
          if (s) {
            var b = s.split(';');
            a = a.concat(b);
          }
          a.push('');
          p.setAttribute('style', a.join(';'));
          return p;
        };

        p.empty = function () {
          p.innerHTML = '';
          return p;
        };

        p.html = function (s) {
          if (isUndefined(s)) {
            return p.innerHTML;
          }
          p.innerHTML = s;
          return p;
        };

        p.destroy = function () {
          if (p.parentNode) {
            p.parentNode.removeChild(p);
          }
        };
      })();
    }
    return p;
  };

  add = function add(tag, parent) {
    var p = parent ? get(parent) : doc.body;
    var d = isElement(tag) ? tag : doc.createElement(tag);
    p.appendChild(d);
    return get(d);
  };

  create = function create(tag) {
    return get(doc.createElement(tag));
  };

  query = function query(c) {
    var el = void 0;
    var tmp = doc.querySelector(c);
    if (tmp) {
      el = get(tmp);
    }
    return el;
  };

  queryAll = function queryAll(c) {
    var els = [];
    var tmp = doc.querySelectorAll(c);
    if (tmp) {
      for (var i = 0; i < tmp.length; i++) {
        els.push(get(tmp[i]));
      }
    }
    return els;
  };

  var onready = function onready(fn) {
    var rt = doc.readyState;
    var c = rt !== 'loading';
    if (c) {
      setTimeout(fn, 0);
    } else {
      doc.addEventListener('DOMContentLoaded', fn);
    }
  };

  var Event = function () {

    var isGecko = function (ua) {
      var n = ua.toLowerCase();
      return (/gecko/i.test(n)
      );
    }(nav.userAgent);

    return {
      on: function on(element, event, fn) {
        if (fn && isFunction(fn)) {
          var el = isString(element) ? get(element) : element;
          if (el && isElement(el)) {
            if (event === 'wheel') {
              event = isGecko ? 'DOMMouseScroll' : 'mousewheel';
            }
            if (el.addEventListener) {
              el.addEventListener(event, fn, false);
            } else if (el.attachEvent) {
              el.attachEvent('on' + event, fn);
            }
          }
        }
      },
      off: function off(element, event, fn) {
        if (fn && isFunction(fn)) {
          var el = isString(element) ? get(element) : element;
          if (el && isElement(el)) {
            if (el.removeEventListener) {
              el.removeEventListener(event, fn, false);
            } else if (el.detachEvent) {
              el.detachEvent('on' + event, fn);
            }
          }
        }
      },
      simulate: function simulate(element, event) {
        var evt = void 0;
        var el = isString(element) ? get(element) : element;
        if (doc.createEventObject) {
          evt = doc.createEventObject();
          el.fireEvent('on' + event, evt);
        } else {
          evt = doc.createEvent('HTMLEvents');
          evt.initEvent(event, true, true);
          el.dispatchEvent(evt);
        }
      },
      stop: function stop(e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      },
      locate: function locate(e) {
        var evt = e || win.event;
        var targ = evt.target || evt.srcElement;
        if (targ && targ.nodeType === 3) {
          targ = targ.parentNode;
        }
        return get(targ);
      }
    };
  }();

  return {
    ready: onready,
    one: query,
    all: queryAll,
    get: get,
    add: add,
    create: create,
    Event: Event
  };
});