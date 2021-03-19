'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localStorageProcessing = require('./localStorageProcessing');

var _localStorageProcessing2 = _interopRequireDefault(_localStorageProcessing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var name = options.name || 'localStorage';
    var storage = options.storage || window.localStorage;

    if (typeof process !== 'undefined' && (process.server || process.SERVER_BUILD || process.env && process.env.VUE_ENV === 'server')) {
      return;
    }

    try {
      var test = '_localstorage-test_';

      storage.setItem(test, test);
      storage.removeItem(test);
    } catch (e) {
      return;
    }

    Vue.localStorage = Vue.prototype['$' + name] = new _localStorageProcessing2.default(storage);
  }
};