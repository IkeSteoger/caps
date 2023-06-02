'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');
let capsQueue = new Queue();

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

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined the ${room} room.`);
  });

  socket.onAny((event, payload) => {
    logger(event, payload);
  });

  socket.on('pickup', (payload) => {
    let driverQueue = capsQueue.read('DRIVER');
    if(!driverQueue){
      let queueKey = capsQueue.store('DRIVER', new Queue());
      driverQueue = capsQueue.read(queueKey);
    }
    driverQueue.store(payload.messageId, payload);
    socket.broadcast.emit('pickup', payload);
  });

  socket.on('received', (payload) => {
    let currentQueue = capsQueue.read(payload.queueId);
    if(!currentQueue){
      throw new Error('we have messages but no queue!');
    }
    let order = currentQueue.remove(payload.messageId);
    socket.broadcast.emit('received', order);
  });

  socket.on('in-transit', (payload) => {

    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let vendorQueue = capsQueue.read(payload.queueId);
    if(!vendorQueue){
      let queueKey = capsQueue.store(payload.queueId, new Queue());
      vendorQueue = capsQueue.read(queueKey);
    }
    vendorQueue.store(payload.messageId, payload);
    socket.to(payload.queueId).emit('delivered', payload);
  });

  socket.on('getAll', (payload) => {
    console.log('attempting to getAll messages!');
    let currentQueue = capsQueue.read(payload.queueId);
    if(currentQueue && currentQueue.data){
      const ids = Object.keys(currentQueue.data);
      ids.forEach(messageId => {
        let savedPayload = currentQueue.read(messageId);
        socket.emit(savedPayload.event, savedPayload);
      });
    }
  });

});
