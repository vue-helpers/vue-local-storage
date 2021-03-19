'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorageProcessing = function () {
  function LocalStorageProcessing(storage) {
    _classCallCheck(this, LocalStorageProcessing);

    this.storage = storage;
  }

  _createClass(LocalStorageProcessing, [{
    key: 'setItem',
    value: function setItem(key, value) {
      var alias = {
        'Null': '0',
        'Date': 'd',
        'Number': 'n',
        'Boolean': 'b',
        'Function': 'f'
      };
      var type = Object.prototype.toString.call(value).split(/\s|]/)[1];
      var formattedValue = void 0;

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
    key: 'getItem',
    value: function getItem(key) {
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
    key: 'removeItem',
    value: function removeItem(key) {
      this.storage.removeItem(key);
    }
  }]);

  return LocalStorageProcessing;
}();

exports.default = LocalStorageProcessing;