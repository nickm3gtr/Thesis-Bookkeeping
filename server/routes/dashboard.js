const express = require('express')
const router = express.Router()
const db = require('../models')

// Get transactions recorded by branch
router.get("/transactions-recorded/:branchId", (req, res) => {
  const { branchId } = req.params
  db.sequelize.query("select count(t.id) \n" +
    "from \"Transactions\" t inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
      "where b.\"BranchId\"=:branchId", {
        model: db.Transaction,
        replacements: { branchId }
      }).then(count => res.json(count))
        .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get sales this month
router.get("/sales/:branchId/:month", (req, res) => {
  const { branchId, month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "where tr.\"AccountId\" between 40000 and 50000 and b.\"BranchId\"=:branchId \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { branchId, month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

//Get expenses this month
router.get("/expenses/:branchId/:month", (req, res) => {
  const { branchId, month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "where tr.\"AccountId\" between 70000 and 80000 and b.\"BranchId\"=:branchId \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { branchId, month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get transactions recorded by all branches
router.get("/admin/transactions-recorded", (req, res) => {
  db.sequelize.query("select count(t.id) \n" +
    "from \"Transactions\" t inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id ", {
        model: db.Transaction
      }).then(count => res.json(count))
        .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get sales this month all branches
router.get("/admin/sales/:month", (req, res) => {
  const {month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "where tr.\"AccountId\" between 40000 and 50000 \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

//Get expenses this month all branches
router.get("/admin/expenses/:month", (req, res) => {
  const { month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "where tr.\"AccountId\" between 70000 and 80000 \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

module.exports = router