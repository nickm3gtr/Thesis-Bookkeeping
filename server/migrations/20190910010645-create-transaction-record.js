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
      BookkeeperId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookkeepers',
          key: 'id'
        }
      },
      TransId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      AccountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id'
        }
      },
      memo: {
        type: Sequelize.STRING
      },
      debit: {
        type: Sequelize.DECIMAL(10, 2)
      },
      credit: {
        type: Sequelize.DECIMAL(10, 2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TransactionRecords');
  }
};