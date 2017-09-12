const { swagger } = require('./config');
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');
const appRoot = require('app-root-path');

module.exports = (app) => {
  const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: swagger,
    apis: [`${appRoot}/src/endpoints/**/*.js`]
  });

  app.use('/docs', express.static(`${appRoot}/src/public/swagger`));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
