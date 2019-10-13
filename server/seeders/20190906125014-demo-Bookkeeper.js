'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookkeepers', [{
      userName: 'bookkeeper1',
      password: '$2a$10$e3jxrDRbzZh4bd2fEMKiW.FJK24h80hwrGKgF4OOOnXwTdY7xoHZK',
      account: 'bookkeeper',
      status: 'active',
      BranchId: 1
    }], {});
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bookkeepers', null, {});
  }
};