/**
 * Created by mariuspotor on 25/11/2016.
 */
/**
 * Message model
 * */
module.exports = (sequelize, DataTypes) =>
  sequelize.define('Settings', {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      field: 'type'
    },
    text: {
      type: DataTypes.TEXT,
      field: 'text'
    },
    date: {
      type: DataTypes.DATE,
      field: 'date'
    },
    user: {
      type: DataTypes.TEXT('long'),
      get: function() {
        return JSON.parse(this.getDataValue('user'));
      },
      set: function(val) {
        return this.setDataValue('user', JSON.stringify(val));
      }
    }
  });



