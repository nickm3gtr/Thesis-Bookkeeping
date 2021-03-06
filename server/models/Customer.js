'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    contactPerson: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    number: DataTypes.STRING
  }, { timestamps: false });
  // eslint-disable-next-line no-unused-vars
  Customer.associate = function(models) {
    // associations can be defined here
  };
  return Customer;
};