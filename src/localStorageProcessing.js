export default class LocalStorageProcessing {
  constructor (storage) {
    this.storage = storage;
    this.listeners = {};
    this.listening = false;
  }

  #listen () {
    window.addEventListener('storage', (e) => this.#change(e, this));
  }

  #change (e, ctx) {
    const formatType = {
      '0': () => null,
      'd': (v) => new Date(v),
      'n': (v) => Number(v),
      'b': (v) => 'true' === v,
      'f': (v) => Function('return ' + v)()
    };
    const listeners = ctx.listeners[e.key];

    const fire = (listener) => {
      const newValue = e.newValue && /^:[bdfn0]:/.test(e.newValue) ? formatType[e.newValue.slice(1, 2)](e.newValue.slice(3)) : JSON.parse(e.newValue);
      const oldValue =  e.oldValue && /^:[bdfn0]:/.test(e.oldValue) ? formatType[e.oldValue.slice(1, 2)](e.oldValue.slice(3)) : JSON.parse(e.oldValue);

      listener(newValue, oldValue, e.url || e.uri);
    }

    if (listeners) {
      listeners.forEach(fire);
    }
  }

  subscribe (key, fn) {
    if (this.listeners[key]) {
      this.listeners[key].push(fn);
    } else {
      this.listeners[key] = [fn];
    }
    if (this.listening === false) {
      this.#listen();
    }
  }

  unSubscribe (key, fn) {
    const listeners = this.listeners[key];

    if (listeners.length > 0) {
      listeners.splice(listeners.indexOf(fn), 1);
    } else {
      this.listeners[key] = [];
    }
  }

  set (key, value) {
    const alias = {
      'Null': '0',
      'Date': 'd',
      'Number': 'n',
      'Boolean': 'b',
      'Function': 'f'
    };
    const type = Object.prototype.toString.call(value).split(/\s|]/)[1];
    let formattedValue;

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
      formattedValue = JSON.stringify(value)
    }

    this.storage.setItem(key, formattedValue)
  }

  get (key) {
    const value = this.storage.getItem(key);
    const formatType = {
      '0': () => null,
      'd': (v) => new Date(v),
      'n': (v) => Number(v),
      'b': (v) => 'true' === v,
      'f': (v) => Function('return ' + v)()
    };

    return value && /^:[bdfn0]:/.test(value) ? formatType[value.slice(1, 2)](value.slice(3)) : JSON.parse(value);
  }

  remove (key) {
    this.storage.removeItem(key);
  }

  clear () {
    this.storage.clear();
  }
};
