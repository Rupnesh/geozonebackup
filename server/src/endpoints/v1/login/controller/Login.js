const appRoot = require('app-root-path');

const { User } = require(`${appRoot}/src/models`);
const { UserSession } = require(`${appRoot}/src/models`);
const Promise = require('bluebird');

/**
 * Class that represents User orchestration trough database
 */
module.exports = {
  /**
   * Search for a specific user
   *
   * @param {string} email - user email
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
  }
};
