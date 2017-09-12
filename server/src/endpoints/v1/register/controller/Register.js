const appRoot = require('app-root-path');

const { User } = require(`${appRoot}/src/models`);
const Promise = require('bluebird');

/**
 * Class that represents User orchestration trough database
 */
module.exports = {
  /**
   * Adds a User to database
   *
   * @param {Object} user - user JSON object
   */
  add(user) {
    return new Promise((resolve, reject) => {
      User
        .create(user)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /**
   * Removes an user from database
   *
   * @param {integer} userId - user Id
   */
  remove(userId) {
    return new Promise((resolve, reject) => {
      User
        .destroy({
          where: {
            id: userId
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

  listAll(obj) {
    return new Promise((resolve, reject) => {
      User
        .findAll({
          where: {
            email: obj.email
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
