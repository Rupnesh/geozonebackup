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
    const email = req.body.emails[0].value;
    const password = req.body.password[0].value;
    Login
      .findByEmailPassword(email, password)
      .then((user) => {
        if (user) {
          let token = jwt.sign(user.dataValues, secret, {
            expiresIn: "7d"
          });
          res.json({
            success: true,
            user: user,
            token,
          });
        }
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  });
};
