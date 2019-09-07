'use strict';
module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
    branchName: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  Branch.associate = function(models) {
    Branch.hasMany(models.Bookkeeper)
  };
  return Branch;
};