const types = require('../libs/types')

'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Types', types, {})
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Types', null, {})
  }
};
