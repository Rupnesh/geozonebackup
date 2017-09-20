const amqp = require('amqplib');
const { CLOUDAMQP_URL } = require('./config');
const PubSubService = require('./utils/PubSubService');

module.exports = {
  start(q) {
    this.connOpen = amqp.connect(CLOUDAMQP_URL);
    this.connOpen.then(function(conn) {
      return conn.createChannel();
    }).then(function(ch) {
      return ch.assertQueue(q, { durable: false }).then(function(ok) {
        return ch.consume(q , function(msg) {
          if (msg !== null) {
            // console.log('==== start === ');
            // console.log(msg.content.toString());
            // console.log('==== end === ');
            PubSubService.publish(q, msg.content.toString());
          }
        }, { noAck: true });
      });
    }).catch(console.warn);
  },
  
  stop() {
    if (this.connOpen) {
      this.connOpen.close()
    }
  }
};
