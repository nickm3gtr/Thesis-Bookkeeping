const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

router.post('/', auth, (req, res) => {
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
  // eslint-disable-next-line no-console
  console.log(mapData)
  db.TransactionRecord.bulkCreate(mapData, { returning: true })
    .then(transactions => res.json(transactions))
    .catch(err => { res.status(400).json({ msg: 'Error', err }) })
})

module.exports = router