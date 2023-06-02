'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

const pickupOccurred = (payload) => {
  console.log('DRIVER: picking up', payload.order.orderId);
  socket.emit('in-transit', payload);
};

const packageDelivered = (payload) => {
  console.log('DRIVER: delivered', payload.order.orderId);
  socket.emit('delivered', {...payload, event: 'delivered'});
};

const handlePickupAndDelivery = (payload) => {
  setTimeout(() => {
    pickupOccurred(payload);
  }, 1000);
  setTimeout(() => {
    packageDelivered(payload);
  }, 2000);
  socket.emit('received', {queueId: 'DRIVER', messageId: payload.messageId});
};

module.exports = { pickupOccurred, packageDelivered, handlePickupAndDelivery };