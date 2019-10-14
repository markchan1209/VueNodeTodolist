'use strict';
const util = require('../../util/index');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('AdminUser', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    disabled: DataTypes.BOOLEAN
  }, util.addModelCommonOptions({
    tableName: 'admin_user',
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    }
  }));
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};