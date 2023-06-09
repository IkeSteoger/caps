'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');
const { handlePickupAndDelivery } = require('./handler');

socket.emit('getAll', {queueId: 'DRIVER'});

socket.on('pickup', handlePickupAndDelivery); 