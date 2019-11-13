'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TransactionRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TransId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Transactions',
          key: 'id'
        }
      },
      AccountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      debit: {
        type: Sequelize.DECIMAL(10, 2)
      },
      credit: {
        type: Sequelize.DECIMAL(10, 2)
      },
      tags: {
        type: Sequelize.STRING
      },
      sub: {
        type: Sequelize.JSONB
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TransactionRecords');
  }
};