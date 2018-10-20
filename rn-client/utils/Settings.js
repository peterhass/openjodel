import { SecureStore } from 'expo'
import _ from 'lodash'

class Observable {
  constructor({ getterAsync }) {
    this.observers = []
    this.getterAsync = getterAsync
  }

  subscribe(observer, notifyNow = false) {
    this.observers.push(observer)

    if(notifyNow)
      this.getterAsync().then(observer)
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((item) => item !== observer)
  }

  notifyAll(data) {
    this.observers.forEach(observer => observer(data))
  }
}

class Setting {
  constructor(key) {
    this.key = key
    this._observable = new Observable({ getterAsync: this.getAsync.bind(this) })
    this.subscribe = this._observable.subscribe.bind(this._observable)
    this.unsubscribe = this._observable.unsubscribe.bind(this._observable)
  }

  getAsync() {
    return SecureStore.getItemAsync(this.key)
  }

  async setAsync(value) {
    if(value !== null)
      await SecureStore.setItemAsync(this.key, value)
    else
      await SecureStore.deleteItemAsync(this.key)

    this._observable.notifyAll(value)
  }
}

export default {
  homeStreamId: new Setting('home-stream-id')
}
