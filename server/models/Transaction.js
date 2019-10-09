/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    num: DataTypes.STRING,
    memo: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.Branch, { foreignKey: 'BranchId' })
    Transaction.belongsTo(models.Book, { foreignKey: 'BookId' })
    Transaction.hasMany(models.TransactionRecord)
  };
  return Transaction;
};