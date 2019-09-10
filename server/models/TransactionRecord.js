'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionRecord = sequelize.define('TransactionRecord', {
    TransId: DataTypes.UUID,
    memo: DataTypes.STRING,
    debit: DataTypes.DECIMAL(10, 2),
    credit: DataTypes.DECIMAL(10, 2)
  }, {});
  TransactionRecord.associate = function(models) {
    TransactionRecord.belongsTo(models.Account, { foreignKey: 'AccountId' })
    TransactionRecord.belongsTo(models.Bookkeeper, { foreignKey: 'BookkeeperId' })
  };
  return TransactionRecord;
};