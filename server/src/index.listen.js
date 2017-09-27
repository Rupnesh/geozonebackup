const http = require('http');
const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');

const PubSubService = require('./utils/PubSubService');
const ampq = require('index.ampq');
const { api } = require('./config');

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

module.exports = function listen(app) {
  const server = api.ssl === true ? https.Server(httpsOptions, app) : http.Server(app);
  const io = socketIO(server);
  server.listen(api.port, function started() {
    const address = this.address();
    const host = address.address !== '::' ? address.address : 'localhost';
    const port = address.port;
    console.log('App listening at http://%s:%s', host, port);
    console.log('Swagger Doc started at at http://%s:%s/docs', host, port);
  });
  
  io.on('connection', (socket) => {
      console.log('=== SOCKET CONNECTED === ');
      PubSubService.unsubscribeAll(socket);
      // start messaging queues
      socket.on('disconnectMe', () => {
        console.log('DISCONNECT');
        socket.disconnect(0);
      });
      
      socket.on('subscribe', (queue) => {
        console.log('SUBSCRIBE - '+ queue);
        socket.join(queue);
        setTimeout(() => {
          PubSubService.subscribe(queue, (data) => {
            socket.broadcast.to(queue).emit(`data-${queue}`, data);
          }, socket);
        }, 1000);
      });
      
      socket.on('unsubscribe', (queue) => {
        console.log('UNSUBSCRIBE - '+ queue);
        PubSubService.unsubscribe(queue, socket);
        socket.leave(queue);
      });
    }
  );
  setTimeout(() => {
    ampq.connect()
      .then((ch) => {
        // connect to the following channels and yield data
        ampq.start(ch, 'GPSJSON');
        ampq.start(ch, 'IMU_1');
      })
      .catch(() => {});
  }, 1000);
};

