'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [{
      userName: 'admin',
      password: '$2a$10$e3jxrDRbzZh4bd2fEMKiW.FJK24h80hwrGKgF4OOOnXwTdY7xoHZK',
      account: 'admin'
    }], {});
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {});
  }
};