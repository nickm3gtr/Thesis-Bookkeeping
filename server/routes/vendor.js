const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Add vendor
router.post('/', auth, (req, res) => {
  const { name } = req.body
  db.Vendor.create({ name })
    .then(vendor => res.json(vendor))
    .catch(err => res.status(400).json({ msg: 'Error adding vendor', err }))
})

// Show all vendors
router.get('/', auth, (req, res) => {
  db.Vendor.findAll()
    .then(vendor => res.json(vendor))
    .catch(err => res.status(400).json({ msg: 'Error fetching vendors', err }))
})

//Delete Vendor
router.delete('/', auth, (req, res) => {
  const { items } = req.body
  db.Vendor.destroy({
    where: {
      id: [...items]
    }
  }).then(() => res.json({ msg: "Deleted" }))
    .catch(() => res.status(400).json({ msg: "Can't delete" }))
})

// Vendor balance
router.get('/bookkeeper/balances/:id', auth, (req, res) => {
  const { id } = req.params

  if (id == 0) {
    db.sequelize.query("select coalesce(sum(tr.debit),0) - coalesce(sum(tr.credit), 0) as balance, tr.sub->'name' as name \n" + 
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where \"AccountId\"=105 and t.validated='validated' \n" +
    "group by name", {
      model: db.Vendor,
      replacements: { id }
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
  } else {
    db.sequelize.query("select coalesce(sum(tr.debit),0) - coalesce(sum(tr.credit), 0) as balance, tr.sub->'name' as name \n" + 
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where \"AccountId\"=105 and b.\"BranchId\"=:id and t.validated='validated' \n" +
    "group by name", {
      model: db.Vendor,
      replacements: { id }
    }).then(balances => res.json(balances))
      .catch(err => res.status(400).json({ msg: 'Cant fetch bank balances', err }))
  }
})

// Update AP subaccount in Accounts table
router.put('/update-account', auth, (req, res) => {
  const { sub } = req.body
  db.Account.update({ sub },
    {where: {
        id: 105
      }
  }).then(account => res.json(account))
    .catch(err => res.status(400).json({ msg: 'Error updating', err }))
})
module.exports = router