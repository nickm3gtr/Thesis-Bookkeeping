'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Branches', [
      {
        branchName: 'DARBMUPCO-A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        branchName: 'DARBMUPCO-B',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        branchName: 'DARBMUPCO-C',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        branchName: 'DARBMUPCO-D',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        branchName: 'DARBMUPCO-E',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Branches', null, {});
  }
};
