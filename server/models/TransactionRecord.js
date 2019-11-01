'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionRecord = sequelize.define('TransactionRecord', {
    debit: DataTypes.DECIMAL(10, 2),
    credit: DataTypes.DECIMAL(10, 2),
    tags: DataTypes.STRING,
    sub: DataTypes.JSONB
  }, { timestamps: false });
  TransactionRecord.associate = function(models) {
    TransactionRecord.belongsTo(models.Account, { foreignKey: 'AccountId' })
    TransactionRecord.belongsTo(models.Transaction, { foreignKey: 'TransId' })
  };
  return TransactionRecord;
};