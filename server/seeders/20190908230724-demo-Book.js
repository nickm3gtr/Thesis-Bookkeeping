'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Books', [
        {
          id: 1,
          name: 'General Journal'
        },
        {
          id: 2,
          name: 'Cash Receipt Book'
        },
        {
          id: 3,
          name: 'Cash Disbursement Book'
        },
        {
          id: 4,
          name: 'Purchase Book'
        },
        {
          id: 5,
          name: 'Sales Book'
        },
      ], {});
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Books', null, {});
  }
};
