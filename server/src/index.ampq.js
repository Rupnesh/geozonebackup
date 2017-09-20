const amqp = require('amqplib');
const { CLOUDAMQP_URL } = require('./config');
const PubSubService = require('./utils/PubSubService');

module.exports = (q) => {
  const open = amqp.connect(CLOUDAMQP_URL);
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q, { durable: false, noAck: true }).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          // console.log('==== start === ');
          // console.log(msg.content.toString());
          // console.log('==== end === ');
          PubSubService.publish(q, msg.content.toString());
        }
      });
    });
  }).catch(console.warn);
};
