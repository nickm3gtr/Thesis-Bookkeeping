'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionRecord = sequelize.define('TransactionRecord', {
    TransId: DataTypes.UUID,
    memo: DataTypes.STRING,
    debit: DataTypes.DECIMAL(10, 2),
    credit: DataTypes.DECIMAL(10, 2),
    date: DataTypes.DATE
  }, { timestamps: false });
  TransactionRecord.associate = function(models) {
    TransactionRecord.belongsTo(models.Account, { foreignKey: 'AccountId' })
    TransactionRecord.belongsTo(models.Bookkeeper, { foreignKey: 'BookkeeperId' })
    TransactionRecord.belongsTo(models.Book, { foreignKey: 'BookId' })
  };
  return TransactionRecord;
};