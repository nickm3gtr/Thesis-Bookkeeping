'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  Customer.associate = function(models) {
    // associations can be defined here
  };
  return Customer;
};