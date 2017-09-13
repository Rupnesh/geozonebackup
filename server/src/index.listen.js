const { api, rabbitMQ } = require('./config');
const http = require('http');
const socketIO = require('socket.io');
const amqp = require('amqp');

module.exports = function listen(app) {
  const server = http.Server(app);
  const io = socketIO(server);
  const rabbitMQConnection = amqp.createConnection(rabbitMQ, { defaultExchangeName: '' });
  
  server.listen(api.port, function started() {
    const address = this.address();
    const host = address.address !== '::' ? address.address : 'localhost';
    const port = address.port;
    console.log('App listening at http://%s:%s', host, port);
    console.log('Swagger Doc started at at http://%s:%s/docs', host, port);
  });
  
  rabbitMQConnection.on('error', function(e) {
    console.log("Error from amqp: ", e);
  });
  rabbitMQConnection.on('ready', function () {
    console.log('MSGQ READY');
    // Use the default 'amq.topic' exchange
    rabbitMQConnection.queue('IMU_1', function(q) {
      console.log('messages -', q);
      // Catch all messages
      q.bind('#');
    
      // Receive messages
      q.subscribe(function(message) {
        // Print messages to stdout
        console.log(message);
      });
    });
  });
  
  io.on('connection', (socket) => {
      
      socket.on('disconnectMe', () => {
        socket.disconnect(0);
      });
      
      socket.on('subscribe_queue', () => {
        socket.join('queue');
      });
      
      socket.on('unsubscribe_queue', (queue) => {
        socket.leave('queue');
      });
      
      EventBus.on('dataQueue', (data) => {
        socket.broadcast.to('queue').emit('data', data);
      })
    }
  );
};

