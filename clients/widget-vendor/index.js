'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');
const { orderHandler, deliveredMessage }= require('./handler');

setInterval(() => {
  orderHandler();
}, 7000);

socket.emit('join', 'acme-widgets');
socket.emit('getAll', {queueId: 'acme-widgets'});

socket.on('delivered', deliveredMessage);