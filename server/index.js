'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;

const server = new Server();

server.listen(PORT);

function logger(event, payload){
  const timestamp = new Date();
  console.log('EVENT: ', { event, timestamp, payload });
}

const caps = server.of('/caps');
caps.on('connection', (socket) => {
  console.log('socket connected to caps namespace!', socket.id);

  socket.on('pickup', (payload) => {
    logger('pickup', payload);

    socket.broadcast.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    logger('in-transit', payload);

    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    logger('delivered', payload);

    socket.broadcast.emit('delivered', payload);
  });

});
