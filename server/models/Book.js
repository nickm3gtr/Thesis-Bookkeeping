'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    name: DataTypes.STRING
  }, { timestamps: false });
  // eslint-disable-next-line no-unused-vars
  Book.associate = function(models) {
    Book.hasMany(models.TransactionRecord)
  };
  return Book;
};