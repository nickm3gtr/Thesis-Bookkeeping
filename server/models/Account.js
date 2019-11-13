'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    sub: DataTypes.JSONB
  }, { timestamps: false });
  Account.associate = function(models) {
    Account.belongsTo(models.SubType, { foreignKey: 'SubTypeId' })
    Account.hasMany(models.TransactionRecord, { onDelete: 'cascade', hooks: true, constraints: false })
  };
  return Account;
};