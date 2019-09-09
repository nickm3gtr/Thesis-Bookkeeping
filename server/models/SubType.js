'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubType = sequelize.define('SubType', {
    name: DataTypes.STRING
  }, { timestamps: false });
  SubType.associate = function(models) {
    SubType.belongsTo(models.Type, { foreignKey: 'TypeId' })
    SubType.hasMany(models.Account)
  };
  return SubType;
};