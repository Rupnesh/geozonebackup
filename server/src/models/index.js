const Sequelize = require('sequelize');
const appRoot = require('app-root-path');
const walkSync = require('walk-sync');

const { db } = require(`${appRoot}/src/config`);

const models = {};

const sequelize = new Sequelize(db);

const paths = walkSync(`${appRoot}/src/models`, {
  globs: ['**/*.js'],
  ignore: ['index.js']
});

paths.forEach((file) => {
  const model = sequelize.import(`${appRoot}/src/models/${file}`);
  if (model.associate) {
    model.associate(models);
  }
  models[model.name] = model;
});

module.exports = Object.assign(models, { sequelize, Sequelize });
