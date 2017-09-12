const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require('../../../config');
const {Login} = require('./controller');
const {Register} = require('../register/controller');
const {Contacts} = require('../contacts/controller');
const {EMAIL_REGEX} = require('../../../utils/Constants');

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
    Login
      .findByEmail(email)
      .then((user) => {
        if (user) {
          let token = jwt.sign(user.dataValues, secret, {
            expiresIn: "7d"
          });
          // in order to get all the details about this user on the client side, we must send the registration from the Contacts table
          Contacts
            .findByEmail(email)
            .then((response) => {
              const photo = req.body.image.url;
              const responseUserObject = Object.assign({}, response.dataValues, {photo});
              if (response) {
                res.status(200).send({
                  success: true,
                  user: responseUserObject,
                  token
                });
              } else {
                res.status(400).send({
                  success: false
                });
              }
            }).catch((error) => {
            res.status(400).send({
              success: false,
              error
            });
          });
        } else {
          Contacts
            .findByEmail(email)
            .then((contactData) => {
              if (contactData) {
                const userToAdd = {
                  googleid: req.body.googleid,
                  firstname: req.body.name.givenName || '',
                  lastname: req.body.name.familyName || '',
                  email: email,
                  photo: req.body.image.url,
                  status: 'Available',
                  statusMessage: ''
                };
                const responseUserObject = Object.assign({}, contactData.dataValues, {photo: userToAdd.photo});
                if (EMAIL_REGEX.test(email)) {
                  Register
                    .add(userToAdd)
                    .then((data) => {
                      let token = jwt.sign(data.dataValues, secret, {
                        expiresIn: "7d"
                      });
                      // same explanation here
                      res.json({
                        success: true,
                        user: responseUserObject,
                        token,
                      });
                      contactData.update({isUser: true});
                    })
                    .catch((error) => {
                      res.status(400).send(error);
                    });
                } else {
                  res.send({
                    success: false,
                    message: 'Please enter a valid email!'
                  });
                }
              } else {
                res.send({
                  success: false,
                  message: 'The email doesn\'t exists in the contacts list!'
                })
              }
            });
        }
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  });
};
