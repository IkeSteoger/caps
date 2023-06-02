'use strict';

class Queue {
  constructor() {
    this.data = {};
  }

  store(key, value) {
    this.data[key] = value;
    console.log('something was added to the queue');
    return key;
  }

  read(key) {
    return this.data[key];
  }

  remove(key) {
    let value = this.data[key];
    console.log('DATA:', this.data);
    console.log('something was removed from the queue!');
    delete this.data[key];
    return value;
  }
}

module.exports = Queue;