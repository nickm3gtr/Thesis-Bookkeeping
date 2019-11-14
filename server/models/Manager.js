'use strict';
module.exports = (sequelize, DataTypes) => {
  const Manager = sequelize.define('Manager', {
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    account: DataTypes.STRING,
    status: DataTypes.STRING
  }, { timestamps: false });
  // eslint-disable-next-line no-unused-vars
  Manager.associate = function(models) {
    // associations can be defined here
    Manager.belongsTo(models.Branch, { foreignKey: 'BranchId' })
  };
  return Manager;
};