'use strict';

const { orderHandler, deliveredMessage }= require('./handler');
const eventEmitter = require('../eventEmitter');

setInterval(() => {
  orderHandler();
}, 5000);

eventEmitter.on('delivered', deliveredMessage);