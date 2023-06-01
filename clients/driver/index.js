'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');
const { handlePickupAndDelivery } = require('./handler');

socket.on('pickup', handlePickupAndDelivery); 