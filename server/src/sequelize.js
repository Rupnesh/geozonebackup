const mysql = require('mysql');
const models = require('./models');
const { db } = require('./config');

const { sequelize } = models;

module.exports = (callback) => {
  const connection = mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.username,
    password: db.password
  });
  connection.connect();
  connection.query(`CREATE DATABASE IF NOT EXISTS ${db.database};`, (err) => {
    if (err) {
      throw err;
    }
    if (db.wipe) {
      console.log('-- Wiping existing database.');
    }
    sequelize.sync({ force: db.wipe }).then(() => {
      console.log('-- Database synced '.concat(db.wipe ? ': data it\'s wiped & schema recreated' : ''));
      if (callback) callback();
    });
  });
};
