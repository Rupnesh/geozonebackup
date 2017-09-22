const amqp = require('amqplib');
const Promise = require('bluebird');
const { CLOUDAMQP_URL } = require('./config');
const PubSubService = require('./utils/PubSubService');

module.exports = {

  connection: null,
  
  connect() {
    return new Promise((resolve, reject) => {
      this.connection = amqp.connect(CLOUDAMQP_URL);
      this.connection.then((conn) => {
        return conn.createChannel();
      }).then((ch) => {
        resolve(ch);
      }).catch((e) => {
        console.warn(e);
        reject(e);
      });
    });
  },
  
  start(ch, q) {
    ch.assertQueue(q, { durable: false }).then((ok) => {
      return ch.consume(q , function(msg) {
        if (msg !== null) {
          // console.log('==== start === ');
          // console.log("q=", q, " --- ", msg.content.toString());
          // console.log('==== end === ');
          PubSubService.publish(q, msg.content.toString());
        }
      }, { noAck: true });
    });
  },
  disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
};
