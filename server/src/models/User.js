/**
 * User model
 * */
module.exports = (sequelize, DataTypes) =>
  sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING,
      field: 'firstname'
    },
    lastname: {
      type: DataTypes.STRING,
      field: 'lastname'
    },
    email: {
      type: DataTypes.STRING,
      field: 'email'
    },
    password: {
      type: DataTypes.STRING,
      field: 'password'
    },
    photo: {
      type: DataTypes.STRING,
      field: 'photo'
    },
    status: {
      type: DataTypes.STRING,
      field: 'status'
    }
  });

