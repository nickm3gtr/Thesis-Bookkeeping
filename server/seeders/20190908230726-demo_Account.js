const currentAssets = require('../libs/currentAssets')
const nonCurrentAssets = require('../libs/nonCurrentAssets')

'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Accounts', [
        ...currentAssets,
        ...nonCurrentAssets
      ], {})
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Accounts', null, {})
  }
};
