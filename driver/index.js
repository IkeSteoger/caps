'use strict';

const eventEmitter = require('../eventEmitter');
const { handlePickupAndDelivery } = require('./handler');

eventEmitter.on('pickup', handlePickupAndDelivery); 