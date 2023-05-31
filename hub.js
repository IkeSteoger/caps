'use strict';

const eventEmitter = require('./eventEmitter');

require('./vendor/index');
require('./driver/index');

eventEmitter.on('pickup', (payload) => logger('pickup', payload));
eventEmitter.on('in-transit', (payload) => logger('in-transit', payload));
eventEmitter.on('delivered', (payload) => logger('delivered', payload));

function logger(event, payload){
  const timestamp = new Date();
  console.log('EVENT: ', { event, timestamp, payload });
}