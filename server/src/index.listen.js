const http = require('http');
const socketIO = require('socket.io');
const PubSubService = require('./utils/PubSubService');
const ampq = require('index.ampq');
const { api } = require('./config');

module.exports = function listen(app) {
  const server = http.Server(app);
  const io = socketIO(server);
  server.listen(api.port, function started() {
    const address = this.address();
    const host = address.address !== '::' ? address.address : 'localhost';
    const port = address.port;
    console.log('App listening at http://%s:%s', host, port);
    console.log('Swagger Doc started at at http://%s:%s/docs', host, port);
  });
  
  // start messaging queues
  ampq('GPSJSON');
  
  io.on('connection', (socket) => {
      console.log('=== SOCKET CONNECTED === ');
      socket.on('disconnectMe', () => {
        console.log('DISCONNECT');
        socket.disconnect(0);
      });
      
      socket.on('subscribe', (queue) => {
        console.log('SUBSCRIBE -'+ queue);
        socket.join(queue);
        PubSubService.subscribe(queue, (data) => {
          console.log('data = ', data);
          socket.broadcast.to(queue).emit('data', data);
        }, socket);
      });
      
      socket.on('unsubscribe', (queue) => {
        console.log('UNSUBSCRIBE -'+ queue);
        socket.leave(queue);
        PubSubService.unsubscribe(queue, socket);
      });
    }
  );
};

