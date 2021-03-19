"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _listen = new WeakSet();

var _change = new WeakSet();

var LocalStorageProcessing = /*#__PURE__*/function () {
  function LocalStorageProcessing(storage) {
    _classCallCheck(this, LocalStorageProcessing);

    _change.add(this);

    _listen.add(this);

    this.storage = storage;
    this.listeners = {};
    this.listening = false;
  }

  _createClass(LocalStorageProcessing, [{
    key: "subscribe",
    value: function subscribe(key, fn) {
      if (this.listeners[key]) {
        this.listeners[key].push(fn);
      } else {
        this.listeners[key] = [fn];
      }

      if (this.listening === false) {
        _classPrivateMethodGet(this, _listen, _listen2).call(this);
      }
    }
  }, {
    key: "unSubscribe",
    value: function unSubscribe(key, fn) {
      var listeners = this.listeners[key];

      if (listeners.length > 0) {
        listeners.splice(listeners.indexOf(fn), 1);
      } else {
        this.listeners[key] = [];
      }
    }
  }, {
    key: "set",
    value: function set(key, value) {
      var alias = {
        'Null': '0',
        'Date': 'd',
        'Number': 'n',
        'Boolean': 'b',
        'Function': 'f'
      };
      var type = Object.prototype.toString.call(value).split(/\s|]/)[1];
      var formattedValue;

      if (alias.hasOwnProperty(type)) {
        switch (alias[type]) {
          case 'd':
          case 'f':
            value = value.toString();
            break;

          default:
            value = JSON.stringify(value);
        }

        formattedValue = ':' + alias[type] + ':' + value;
      } else {
        formattedValue = JSON.stringify(value);
      }

      this.storage.setItem(key, formattedValue);
    }
  }, {
    key: "get",
    value: function get(key) {
      var value = this.storage.getItem(key);
      var formatType = {
        '0': function _() {
          return null;
        },
        'd': function d(v) {
          return new Date(v);
        },
        'n': function n(v) {
          return Number(v);
        },
        'b': function b(v) {
          return 'true' === v;
        },
        'f': function f(v) {
          return Function('return ' + v)();
        }
      };
      return value && /^:[bdfn0]:/.test(value) ? formatType[value.slice(1, 2)](value.slice(3)) : JSON.parse(value);
    }
  }, {
    key: "remove",
    value: function remove(key) {
      this.storage.removeItem(key);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.storage.clear();
    }
  }]);

  return LocalStorageProcessing;
}();

exports.default = LocalStorageProcessing;

function _listen2() {
  var _this = this;

  window.addEventListener('storage', function (e) {
    return _classPrivateMethodGet(_this, _change, _change2).call(_this, e, _this);
  });
}

function _change2(e, ctx) {
  var formatType = {
    '0': function _() {
      return null;
    },
    'd': function d(v) {
      return new Date(v);
    },
    'n': function n(v) {
      return Number(v);
    },
    'b': function b(v) {
      return 'true' === v;
    },
    'f': function f(v) {
      return Function('return ' + v)();
    }
  };
  var listeners = ctx.listeners[e.key];

  var fire = function fire(listener) {
    var newValue = e.newValue && /^:[bdfn0]:/.test(e.newValue) ? formatType[e.newValue.slice(1, 2)](e.newValue.slice(3)) : JSON.parse(e.newValue);
    var oldValue = e.oldValue && /^:[bdfn0]:/.test(e.oldValue) ? formatType[e.oldValue.slice(1, 2)](e.oldValue.slice(3)) : JSON.parse(e.oldValue);
    listener(newValue, oldValue, e.url || e.uri);
  };

  if (listeners) {
    listeners.forEach(fire);
  }
}

;