const appRoot = require('app-root-path');
const mysql = require('mysql');
const pgtools = require('pgtools');
const models = require('./models');
const { User } = require(`${appRoot}/src/models`);
const { db } = require('./config');

const { sequelize } = models;

module.exports = (callback) => {
  
  function initSequelize(err) {
    if (err) {
      throw err;
    }
    if (db.wipe) {
      console.log('-- Wiping existing database.');
    }
    
    sequelize
      .sync({ force: db.wipe })
      .then(() => {
        User.bulkCreate([
            {
              firstname: 'Andrei',
              lastname: 'Lakatos',
              email: 'andrei@mcro-e.com',
              password: 'geozone2017'
            },
            {
              firstname: 'Alex',
              lastname: 'Lazar',
              email: 'alex@mcro-e.com',
              password: 'geozone2017'
            },
            {
              firstname: 'Ian',
              lastname: 'Peters',
              email: 'ian@geozone.com',
              password: 'geozone2017'
            },
            {
              firstname: 'Damon',
              lastname: 'Hermann',
              email: 'damon@geozone.com',
              password: 'geozone2017'
            }
          ])
          .then(function() {
            console.log('-- Database synced '.concat(db.wipe ? ': data it\'s wiped & schema recreated' : ''));
            if (callback) callback();
          });
      });
  }
  
  if (db.dialect === 'mysql') {
    const connection = mysql.createConnection({
      host: db.host,
      port: db.port,
      user: db.username,
      password: db.password
    });
    connection.connect();
    connection.query(`CREATE DATABASE IF NOT EXISTS ${db.database};`, initSequelize);
  } else if ( db.dialect === 'postgres' ) {
    // TODO: make a check if the db exists and create it only if doesn't
    pgtools.dropdb({
      user: db.username,
      password: db.password,
      port: db.port,
      host: db.host
    }, `${db.database}`, () => {
      pgtools.createdb({
        user: db.username,
        password: db.password,
        port: db.port,
        host: db.host
      }, `${db.database}`, initSequelize);
    });
  }
  // add support for more dbs
};
