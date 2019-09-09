'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING
  }, { timestamps: false });
  // eslint-disable-next-line no-unused-vars
  Admin.associate = function(models) {
    // associations can be defined here
  };
  return Admin;
};