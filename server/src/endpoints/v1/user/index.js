/**
 * Created by mariuspotor on 18/10/16.
 */
/**
 * Created by mariuspotor on 10/18/16.
 */

const { User } = require('./controller');
const appRoot = require('app-root-path');
const tokenValidation = require(`${ appRoot }/src/services/TokenService`);

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - googleid
 *       - firstname
 *       - lastname
 *       - email
 *       - photo
 *     properties:
 *       googleid:
 *         type: integer
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       email:
 *         type: string
 *       photo:
 *         type: string
 */
module.exports = (router) => {
  /**
   * @swagger
   * /v1/users:
   *   get:
   *     summary: List all Users
   *     description: List all Users as an JSON array
   *     tags:
   *       - Users
   *     produces:
   *       - routerlication/json
   *     responses:
   *       200:
   *         description: "successful operation"
   *         schema:
   *           type: array
   *           items:
   *             "$ref": "#/definitions/User"
   *       400:
   *         description: "bad request"
   */
  router.get('/users', (req, res) => {
    const tokenValidity = tokenValidation.validateToken(req);

    if (tokenValidity.success === true) {
      User
        .list()
        .then((data) => {
          res.send({
            success: true,
            data
          });
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    } else {
      return res.status(403).send({
            success: false,
            message: 'No token provided.'
          });
    }
  });

  /**
   * @swagger
   * /v1/users/{id}:
   *   get:
   *     summary: Get a User
   *     description: Get a User
   *     tags:
   *       - Users
   *     produces:
   *       - routerlication/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: "User id"
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: "successful operation"
   *         schema:
   *           "$ref": "#/definitions/User"
   *       404:
   *         description: "not found"
   *       400:
   *         description: "bad request"
   */
  router.post('/users/findByEmail', (req, res) => {
    const tokenValidity = tokenValidation.validateToken(req);

    if (tokenValidity.success === true) {
      User
        .findByEmail(req.body.email)
        .then((data) => {
          if (data <= 0) {
            res.sendStatus(404);
          } else {
            res.send({
              success : true,
              data
            });
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  /**
   * @swagger
   * /v1/user/{id}:
   *   patch:
   *     summary: Update a User
   *     description: Update a User
   *     tags:
   *       - Users
   *     parameters:
   *       - name: id
   *         in: path
   *         description: "User id"
   *         required: true
   *         type: integer
   *       - in: body
   *         name: body
   *         description: "User object that needs to be updated in the users table"
   *         required: true
   *         schema:
   *           "$ref": "#/definitions/User"
   *     produces:
   *       - routerlication/json
   *     responses:
   *       200:
   *         description: "successful operation"
   *       404:
   *         description: "not found"
   *       400:
   *         description: "bad request"
   */
  router.patch('/users/', (req, res) => {
    const tokenValidity = tokenValidation.validateToken(req);

    if (tokenValidity.success === true) {
      User
        .update(tokenValidity.data.email, req.body)
        .then((data) => {
          if (data <= 0) {
            res.sendStatus(404);
          } else {
            res.send({
              success : true,
              data
            });
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });
};
