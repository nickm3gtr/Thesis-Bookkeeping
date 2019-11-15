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

//Delete Bank
router.delete('/', auth, (req, res) => {
  const { items } = req.body
  db.Bank.destroy({
    where: {
      id: [...items]
    }
  }).then(() => res.json({ msg: "Deleted" }))
    .catch(() => res.status(400).json({ msg: "Can't delete" }))
})

// Bank balance
router.get('/bookkeeper/balances/:id', auth, (req, res) => {
  const { id } = req.params

  if (id == 0) {
    db.sequelize.query("select coalesce(sum(tr.debit),0) - coalesce(sum(tr.credit), 0) as balance, tr.sub->'name' as name \n" + 
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where \"AccountId\"=3 \n" +
    "group by name", {
      model: db.Bank,
      replacements: { id }
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
  } else {
    db.sequelize.query("select coalesce(sum(tr.debit),0) - coalesce(sum(tr.credit), 0) as balance, tr.sub->'name' as name \n" + 
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where \"AccountId\"=3 and b.\"BranchId\"=:id \n" +
    "group by name", {
      model: db.Bank,
      replacements: { id }
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
  }
})

// Update CIB subaccount in Accounts table
router.put('/update-account', auth, (req, res) => {
  const { sub } = req.body
  db.Account.update({ sub },
    {where: {
        id: 3
      }
  }).then(account => res.json(account))
    .catch(err => res.status(400).json({ msg: 'Error updating', err }))
})
module.exports = router