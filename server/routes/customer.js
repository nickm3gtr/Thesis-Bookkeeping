const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Add Customer
router.post('/', auth, (req, res) => {
  const { name, contactPerson, address, email, number } = req.body
  db.Customer.create({ name, contactPerson, address, email, number })
    .then(customer => res.json(customer))
    .catch(err => res.status(400).json({ msg: 'Error adding customer', err }))
})

// Show all customers
router.get('/', auth, (req, res) => {
  db.Customer.findAll()
    .then(customer => res.json(customer))
    .catch(err => res.status(400).json({ msg: 'Error fetching customers', err }))
})

// Show Customer by ID
router.get('/:id', auth, (req, res) => {
  const { id } = req.params

  db.sequelize.query("select * \n" +
    "from \"Customers\" \n"+
    "where id=:id", {
      model: db.Customer,
      replacements: { id }
  }).then(customer => res.json(customer))
    .catch(err => res.status(400).json({ msg: 'Error fetching customer data', err }))
})

//Delete Customer
router.delete('/', auth, (req, res) => {
  const { items } = req.body
  db.Customer.destroy({
    where: {
      id: [...items]
    }
  }).then(() => res.json({ msg: "Deleted" }))
    .catch(() => res.status(400).json({ msg: "Can't delete" }))
})

// Customer balance
router.get('/bookkeeper/balances/:id', auth, (req, res) => {
  const { id } = req.params

  if (id == 0) {
    db.sequelize.query("select coalesce(sum(tr.debit),0) - coalesce(sum(tr.credit), 0) as balance, tr.sub->'name' as name \n" + 
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where \"AccountId\"=15 and t.validated='validated' \n" +
    "group by name", {
      model: db.Customer,
      replacements: { id }
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
  } else {
    db.sequelize.query("select coalesce(sum(tr.debit),0) - coalesce(sum(tr.credit), 0) as balance, tr.sub->'name' as name \n" + 
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where \"AccountId\"=15 and b.\"BranchId\"=:id and t.validated='validated' \n" +
    "group by name", {
      model: db.Customer,
      replacements: { id }
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
  }
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