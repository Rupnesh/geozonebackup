const fs = require('fs');
const yaml = require('js-yaml');

const initializeConfig = () => {
  const env = process.env.NODE_ENV || 'local';
  const global = yaml.safeLoad(fs.readFileSync('./src/config/config.yml', 'utf8'));
  const envConfig = yaml.safeLoad(fs.readFileSync(`./src/config/config_${env}.yml`, 'utf8'));

  return Object.assign({}, envConfig, global);
};

module.exports = initializeConfig();
