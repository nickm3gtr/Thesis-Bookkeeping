'use strict';
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    name: DataTypes.STRING
  }, { timestamps: false });
  Type.associate = function(models) {
    Type.hasMany(models.SubType)
  };
  return Type;
};