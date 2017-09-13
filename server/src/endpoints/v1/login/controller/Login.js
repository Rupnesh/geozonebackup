const appRoot = require('app-root-path');

const { User } = require(`${appRoot}/src/models`);
const { UserSession } = require(`${appRoot}/src/models`);
const Promise = require('bluebird');

/**
 * Module that represents User Login
 */
module.exports = {
  /**
   * Search for a specific user
   *
   * @param {string} email - user email
   * @param {string} password - user password
   * @returns {Object}
   */
  findByEmailPassword(email, password) {
    return new Promise((resolve, reject) => {
      User
        .findOne({
          where: {
            email,
            password
          }
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};
