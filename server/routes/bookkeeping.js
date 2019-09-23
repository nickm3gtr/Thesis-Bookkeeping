const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Add general journal transactions
router.post("/general-journal", auth, (req, res) => {
  let { data } = req.body
  const mapData = data.map(data => {
    if (data.debit.length < 1) {
      data.debit = null
    }
    if (data.credit.length < 1) {
      data.credit = null
    }
    return data
  })
  db.TransactionRecord.bulkCreate(mapData, { returning: true })
    .then(transactions => res.json(transactions))
    .catch(err => { res.status(400).json({ msg: 'Error', err }) })
})

// Add CRB transactions
router.post("/cash-receipts", auth, (req, res) => {
  let { data } = req.body
  db.TransactionRecord.bulkCreate(data, { returning: true })
    .then(transactions => res.json(transactions))
    .catch(err => { res.status(400).json({ msg: 'Error', err }) })
})

module.exports = router