let currentAssets = require('../libs/currentAssets')
let nonCurrentAssets = require('../libs/nonCurrentAssets')
let currentLiabilities = require('../libs/currentLiabilities')
let nonCurrentLiabilities = require('../libs/nonCurrentLiabilities')
let equity = require('../libs/equity')
let revenue = require('../libs/revenue')
let costOfGoods = require('../libs/costOfGoods')
let costOfServices = require('../libs/costOfServices')
let expenses = require('../libs/expenses')

currentAssets = currentAssets.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
nonCurrentAssets = nonCurrentAssets.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
currentLiabilities = currentLiabilities.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
nonCurrentLiabilities = nonCurrentLiabilities.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
equity = equity.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
revenue = revenue.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
costOfGoods = costOfGoods.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
costOfServices = costOfServices.map(item => {
  delete item.id
  item.status = 'active'
  return item
})
expenses = expenses.map(item => {
  delete item.id
  item.status = 'active'
  return item
})

'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Accounts', [
        ...currentAssets,
        ...nonCurrentAssets,
        ...currentLiabilities,
        ...nonCurrentLiabilities,
        ...equity,
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
