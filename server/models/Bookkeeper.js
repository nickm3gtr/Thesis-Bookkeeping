'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookkeeper = sequelize.define('Bookkeeper', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  Bookkeeper.associate = function(models) {
    // associations can be defined here
  };
  return Bookkeeper;
};