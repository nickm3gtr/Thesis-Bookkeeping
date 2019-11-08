const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Add bank
router.post('/', auth, (req, res) => {
  const { name } = req.body
  db.Bank.create({ name })
    .then(bank => res.json(bank))
    .catch(err => res.status(400).json({ msg: 'Error adding bank', err }))
})

// Show all banks
router.get('/', auth, (req, res) => {
  db.Bank.findAll()
    .then(banks => res.json(banks))
    .catch(err => res.status(400).json({ msg: 'Error fetching banks', err }))
})

// Bank balance
router.get('/balances', auth, (req, res) => {
  db.sequelize.query("select coalesce(sum(debit),0) - coalesce(sum(credit), 0) as balance,sub->'name' as name \n" +
    "from \"TransactionRecords\" \n" +
    "where \"AccountId\"=3 \n" +
    "group by name", {
      model: db.Bank
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
})

module.exports = router