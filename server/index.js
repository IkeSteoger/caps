'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');
let messageQueue = new Queue();

const server = new Server();

console.log('listening on PORT:', PORT);
server.listen(PORT);

function logger(event, payload){
  const timestamp = new Date();
  console.log('EVENT: ', { event, timestamp, payload });
}

const caps = server.of('/caps');
caps.on('connection', (socket) => {
  console.log('socket connected to caps namespace!', socket.id);

  socket.onAny((event, payload) => {
    logger(event, payload);
  });

  socket.on('pickup', (payload) => {
    let currentQueue = messageQueue.read('DRIVER');
    if(!currentQueue){
      let queueKey = messageQueue.store('DRIVER', new Queue());
      currentQueue = messageQueue.read(queueKey);
    }
    currentQueue.store(payload.orderId, payload);
    socket.broadcast.emit('pickup', payload);
  });

  socket.on('received', (payload) => {
    let id = payload.queueId ? payload.queueId : payload.store;
    let currentQueue = messageQueue.read(id);
    if(!currentQueue){
      throw new Error('we have messages but no queue!');
    }
    let order = currentQueue.remove(id);
    socket.broadcast.emit('received', order);
  });

  socket.on('in-transit', (payload) => {

    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let currentQueue = messageQueue.read(payload.store);
    if(!currentQueue){
      let queueKey = messageQueue.store(payload.store, new Queue());
      currentQueue = messageQueue.read(queueKey);
    }
    currentQueue.store(payload.store, payload);
    socket.broadcast.emit('delivered', payload);
  });

  socket.on('getAll', (payload) => {
    console.log('attempting to get messages!');
    let currentQueue = messageQueue.read(payload.queueId);
    if(currentQueue && currentQueue.data){
      Object.keys(currentQueue.data).forEach(orderId => {
        socket.emit('pickup', currentQueue.read(orderId));
      });
    }
  });

});
