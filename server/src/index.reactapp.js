const express = require('express');
const appRoot = require('app-root-path');

module.exports = (app) => {
  app.use('/', express.static(`${appRoot}/../client/build`));
};
