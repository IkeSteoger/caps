'use strict';

const eventEmitter = require('./eventEmitter');

const payload = require('./chance');
const { newOrderHandler, deliveredHandler } = require('./vendor');
const { pickupHandler, intransitHandler } = require('./driver');

newOrderHandler(payload);
eventEmitter.on('PICKUP', pickupHandler);
eventEmitter.on('IN-TRANSIT', deliveredHandler);
eventEmitter.on('DELIVERED', intransitHandler);
eventEmitter.on('EVENT', (event, payload) => {
  let timestamp = new Date().toISOString();
  console.log(`EVENT: { event: ${event}, time: ${timestamp}, payload: ${JSON.stringify(payload)} }` );
});


