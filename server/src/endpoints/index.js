const appRoot = require('app-root-path');
const walkSync = require('walk-sync');

module.exports = (router, version) => {
  const req = require;
  const paths = walkSync(`${appRoot}/src/endpoints/${version}/`, {
    globs: ['**/*.js'],
    ignore: ['index.js', '**/controller/*.js', '**/tests/*.js', '**/test/*.js']
  });
  paths.forEach(path => req(`${appRoot}/src/endpoints/${version}/${path}`)(router));
};
