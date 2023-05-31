'use strict';

let eventEmitter = require('../eventEmitter');

const pickupHandler = (payload) => {
  setTimeout(() => {
    console.log('DRIVER: picked up ', payload.orderId);
    
    eventEmitter.emit('EVENT', 'in-transit', payload);
    eventEmitter.emit('IN-TRANSIT', payload);
  }, 500);
};

const intransitHandler = (payload) => {
  setTimeout(() => {
    console.log('DRIVER: delivered up', payload.orderId);
    console.log('VENDOR: Thank you for delivering', payload.orderId);
    
    eventEmitter.emit('EVENT', 'delivered', payload);
  }, 500);
};
  
module.exports = { pickupHandler, intransitHandler };