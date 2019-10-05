'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionRecord = sequelize.define('TransactionRecord', {
    TransId: DataTypes.STRING,
    num: DataTypes.STRING,
    memo: DataTypes.STRING,
    debit: DataTypes.DECIMAL(10, 2),
    credit: DataTypes.DECIMAL(10, 2),
    tags: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  TransactionRecord.associate = function(models) {
    TransactionRecord.belongsTo(models.Account, { foreignKey: 'AccountId' })
    TransactionRecord.belongsTo(models.Branch, { foreignKey: 'BranchId' })
    TransactionRecord.belongsTo(models.Book, { foreignKey: 'BookId' })
  };
  return TransactionRecord;
};