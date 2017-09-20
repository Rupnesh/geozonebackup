const mysql = require('mysql');
const { Client } = require('pg');
const models = require('./models');
const { db } = require('./config');

const { sequelize } = models;

module.exports = (callback) => {
  let connection = null;
  if (db.dialect === 'mysql') {
    connection = mysql.createConnection({
      host: db.host,
      port: db.port,
      user: db.username,
      password: db.password
    });
  } else if ( db.dialect === 'postgres' ) {
    connection = new Client({
      host: db.host,
      port: db.port,
      user: db.username,
      password: db.password,
      database: db.database
    });
  } else {
    return ;
  }
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
