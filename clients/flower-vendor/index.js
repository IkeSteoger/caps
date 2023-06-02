'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');
const { orderHandler, deliveredMessage }= require('./handler');

setInterval(() => {
  orderHandler();
}, 5000);

socket.emit('getAll', {queueId: '1-206-flowers'});

socket.on('delivered', deliveredMessage);