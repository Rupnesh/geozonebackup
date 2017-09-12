const walkSync = require('walk-sync');
const appRoot = require('app-root-path');
const setup = require('./setup');

describe('Test Suite', () => {
  const paths = walkSync('./src', { globs: ['**/tests/*.js'] });

  before((done) => {
    // run the setup to initialize DB and create the right models
    setup(done);
  });

  paths.forEach(filename => require(`${appRoot}/src/${filename}`)()); // eslint-disable-line global-require, max-len

  after((done) => {
    done();
  });
});
