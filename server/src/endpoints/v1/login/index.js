const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config');
const { Login } = require('./controller');
const { EMAIL_REGEX } = require('../../../utils/Constants');

/**
 * @swagger
 * definitions:
 *   Login:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */
module.exports = (router) => {
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login with email and password
   *     description: Find a user by email
   *     tags:
   *       - Users
   *     produces:
   *       - routerlication/json
   *     parameters:
   *       - in: body
   *         name: body
   *         description: "An object with email and password"
   *         required: true
   *         schema:
   *           "$ref": "#/definitions/UserSession"
   *     responses:
   *       200:
   *         description: "successful operation"
   *       400:
   *         description: "bad request"
   */
  router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Login
      .findByEmailPassword(email, password)
      .then((user) => {
      let jsonBody = {
        success: false
      };
        if (user) {
          let token = jwt.sign(user.dataValues, secret, {
            expiresIn: "7d"
          });
          jsonBody = {
            success: true,
            user: user,
            token,
          };
        }
  
        res.json(jsonBody);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  });
};
