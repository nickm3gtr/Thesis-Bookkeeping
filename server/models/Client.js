'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  Client.associate = function(models) {
    // associations can be defined here
  };
  return Client;
};