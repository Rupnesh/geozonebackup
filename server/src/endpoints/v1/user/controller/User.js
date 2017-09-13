/**
 * Created by mariuspotor on 17/10/16.
 */
const appRoot = require('app-root-path');

const { User } = require(`${appRoot}/src/models`);
const Promise = require('bluebird');

/**
 * Class that represents User orchestration trough database
 */
module.exports = {
  /**
   * List all registered users from database
   *
   * @returns {Array}
   */
  list() {
    return new Promise((resolve, reject) => {
      User
        .findAll()
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /**
   * Get a specific user
   *
   * @param {integer} email - email
   * @returns {Object}
   */
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      User
        .findOne({
          where: {
            email
          }
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  
  /**
   * Update a specific user on database
   *
   * @param {integer} email - user Id
   * @param {Object} data - user object to update
   */
  update(email, data) {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: {
          email
        }
      }).then((user) => {
        if (user) {
          user
            .update(data)
            .then((res) => {
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject({ error: 'Inexisting id' });
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
};

