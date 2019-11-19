'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Vendor', {
    name: DataTypes.STRING,
    contactPerson: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    number: DataTypes.STRING
  }, { timestamps: false });
  // eslint-disable-next-line no-unused-vars
  Vendor.associate = function(models) {
    // associations can be defined here
  };
  return Vendor;
};