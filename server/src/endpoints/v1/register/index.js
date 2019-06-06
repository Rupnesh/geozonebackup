const { Register } = require('./controller');
const { validator } = require('validator');
const bcrypt = require('bcryptjs');


/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - firstname
 *       - lastname
 *       - password
 *       - email
 *       - birthdate
 *       - phone
 *     properties:
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 *       birthdate:
 *         type: date
 *       phone:
 *         type: integer
 */
module.exports = (router) => {
  /**
   * @swagger
   * /v1/register:
   *   post:
   *     summary: Add a User
   *     description: Add a User as a JSON object
   *     tags:
   *       - Users
   *     produces:
   *       - routerlication/json
   *     parameters:
   *       - in: body
   *         name: body
   *         description: "User object that needs to be added to the users table"
   *         required: true
   *         schema:
   *           "$ref": "#/definitions/User"
   *     responses:
   *       200:
   *         description: "successful operation"
   *       400:
   *         description: "bad request"
   */
  router.post('/register', (req, res) => {
    Register
      .listAll({
        email: req.body.email
      })
      .then((users) => {
        if (users.length > 0) {
          res.status(400).send({
            success: false,
            message: 'User with this email already exists!'
          });
        } else {
          if (validator.isEmail(req.body.email)) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.password, salt, (erro, hash) => {
                Register
                  .add({
                    firstname : req.body.firstname,
                    lastname : req.body.lastname,
                    password : hash,
                    email : req.body.email,
                    birthdate : req.body.birthdate,
                    phone : req.body.phone,
                  })
                  .then((data) => {
                    res.send({
                      success : true,
                      data
                    });
                  })
                  .catch((error) => {
                    res.status(400).send(error);
                  });
              });
            });
          } else {
            res.send({
              success: false,
              message: 'Please enter a valid email!'
            });
          }
        }
      });
  });

  /**
   * @swagger
   * /v1/register/{id}:
   *   delete:
   *     summary: Removes a User
   *     description: Removes a User
   *     tags:
   *       - Users
   *     parameters:
   *       - name: id
   *         in: path
   *         description: "User id"
   *         required: true
   *         type: integer
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
  router.delete('/register/:id', (req, res) => {
    Register
      .remove(req.params.id)
      .then((data) => {
        if (!data) {
          res.sendStatus(404);
        } else {
          res.send({
            success: true
          });
        }
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  });
};
