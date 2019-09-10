const express = require('express')
const router = express.Router()
const db = require('../models')

router.post('/', (req, res) => {
  const { data } = req.body
  db.TransactionRecord.bulkCreate(data, { returning: true })
    .then(transactions => res.json(transactions))
    .catch(err => { res.status(400).json({ msg: 'Error', err }) })
})

module.exports = router