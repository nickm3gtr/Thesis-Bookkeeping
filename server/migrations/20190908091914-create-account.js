'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      subAccount: {
        type: Sequelize.JSONB
      },
      SubTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SubTypes',
          key: 'id'
        }
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Accounts');
  }
};