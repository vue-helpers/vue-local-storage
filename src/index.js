import LocalStorageProcessing from "./localStorageProcessing";

export default {
  install(Vue, options = {}) {
    const name = options.name || 'localStorage'
    const storage = options.storage || window.localStorage

    if (typeof process !== 'undefined' && (process.server || process.SERVER_BUILD || (process.env && process.env.VUE_ENV === 'server'))) {
      return
    }

    try {
      const test = '_localstorage-test_'

      storage.setItem(test, test)
      storage.removeItem(test)
    } catch (e) {
      return
    }

    Vue.localStorage = Vue.prototype['$' + name] = new LocalStorageProcessing(storage);
  }
}
