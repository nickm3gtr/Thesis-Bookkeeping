const subtypes = require('../libs/subtypes')

'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('SubTypes', subtypes, {})
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('SubTypes', null, {})
  }
};
