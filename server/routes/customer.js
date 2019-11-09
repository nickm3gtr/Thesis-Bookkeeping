const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Add Customer
router.post('/', auth, (req, res) => {
  const { name } = req.body
  db.Customer.create({ name })
    .then(customer => res.json(customer))
    .catch(err => res.status(400).json({ msg: 'Error adding customer', err }))
})

// Show all customers
router.get('/', auth, (req, res) => {
  db.Customer.findAll()
    .then(customer => res.json(customer))
    .catch(err => res.status(400).json({ msg: 'Error fetching customers', err }))
})

// Customer balance
router.get('/bookkeeper/balances/:id', auth, (req, res) => {
  const { id } = req.params
  db.sequelize.query("select coalesce(sum(tr.debit),0) - coalesce(sum(tr.credit), 0) as balance, tr.sub->'name' as name \n" + 
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where \"AccountId\"=15 and b.\"BranchId\"=:id \n" +
    "group by name", {
      model: db.Bank,
      replacements: { id }
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
})

// Update A/R subaccount in Accounts table
router.put('/update-account', auth, (req, res) => {
  const { sub } = req.body
  db.Account.update({ sub },
    {where: {
        id: 15
      }
  }).then(account => res.json(account))
    .catch(err => res.status(400).json({ msg: 'Error updating', err }))
})

module.exports = router