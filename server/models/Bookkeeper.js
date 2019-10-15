'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookkeeper = sequelize.define('Bookkeeper', {
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    account: DataTypes.STRING,
    status: DataTypes.STRING
  }, { timestamps: false });
  // eslint-disable-next-line no-unused-vars
  Bookkeeper.associate = function(models) {
    Bookkeeper.belongsTo(models.Branch, { foreignKey: 'BranchId' })
    Bookkeeper.hasMany(models.Transaction)
  };
  return Bookkeeper;
};