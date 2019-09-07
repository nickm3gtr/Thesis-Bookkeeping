'use strict';
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    name: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  Type.associate = function(models) {
    Type.hasMany(models.Account)
  };
  return Type;
};