const currentAssets = require('../libs/currentAssets')
const nonCurrentAssets = require('../libs/nonCurrentAssets')
const currentLiabilities = require('../libs/currentLiabilities')
const nonCurrentLiabilities = require('../libs/nonCurrentLiabilities')
const revenue = require('../libs/revenue')
const costOfGoods = require('../libs/costOfGoods')
const costOfServices = require('../libs/costOfServices')
const expenses = require('../libs/expenses')

'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Accounts', [
        ...currentAssets,
        ...nonCurrentAssets,
        ...currentLiabilities,
        ...nonCurrentLiabilities,
        ...revenue,
        ...costOfGoods,
        ...costOfServices,
        ...expenses
      ], {})
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Accounts', null, {})
  }
};
