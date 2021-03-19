export default class LocalStorageProcessing {
  constructor (storage) {
    this.storage = storage;
  }

  setItem (key, value) {
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

  getItem (key) {
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

  removeItem (key) {
    this.storage.removeItem(key)
  }
}
