'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Branches', [
      {
        branchName: 'DARBMUPCO-A'
      },
      {
        branchName: 'DARBMUPCO-B'
      },
      {
        branchName: 'DARBMUPCO-C'
      },
      {
        branchName: 'DARBMUPCO-D'
      },
      {
        branchName: 'DARBMUPCO-E'
      }
    ], {});
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Branches', null, {});
  }
};
