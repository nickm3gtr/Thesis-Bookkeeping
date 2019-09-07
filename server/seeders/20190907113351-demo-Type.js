'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Types', [
      {
        id: 10000,
        name: "Assets",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 20000,
        name: "Liabilities",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 30000,
        name: "Equity",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 40000,
        name: "Revenue",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 50000,
        name: "Cost of Goods Sold",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 60000,
        name: "Cost of Services",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 70000,
        name: "Expenses",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Types', null, {});
  }
};