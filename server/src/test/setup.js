const { sequelize } = require('../sequelize');
module.exports = (done) => {
  sequelize(() => {
    done();
  })
};

