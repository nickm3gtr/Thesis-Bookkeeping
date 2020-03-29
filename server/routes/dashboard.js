const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Get transactions recorded by branch
router.get("/transactions-recorded/:branchId", auth, (req, res) => {
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
router.get("/sales/:branchId/:month", auth, (req, res) => {
  const { branchId, month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
  "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where ty.id = 40000 and b.\"BranchId\"=:branchId and t.validated='validated' \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { branchId, month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

//Get expenses this month
router.get("/expenses/:branchId/:month", auth, (req, res) => {
  const { branchId, month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
  "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where ty.id = 70000 and b.\"BranchId\"=:branchId and t.validated='validated' \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { branchId, month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get transactions recorded by all branches
router.get("/admin/transactions-recorded", auth, (req, res) => {
  db.sequelize.query("select count(t.id) \n" +
    "from \"Transactions\" t inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where t.validated='validated'", {
        model: db.Transaction
      }).then(count => res.json(count))
        .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get sales this month all branches
router.get("/admin/sales/:month", auth, (req, res) => {
  const {month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
  "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where ty.id = 40000 and t.validated='validated' \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

//Get expenses this month all branches
router.get("/admin/expenses/:month", auth, (req, res) => {
  const { month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
  "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where ty.id = 70000 and t.validated='validated' \n" +
  "group by trans_date \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get all sales grouped by branches
router.get("/admin/sales/by-branch/:month", auth, (req, res) => {
  const { month } = req.params
  db.sequelize.query("select extract(month from t.date) as trans_date, br.\"branchName\", sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)) as balance \n" +
  "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
  "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where ty.id = 40000 and t.validated='validated' \n" +
  "group by trans_date, br.\"branchName\" \n" +
  "having extract(month from t.date) = :month", {
    model: db.Transaction,
    replacements: { month }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({msg: err}))
})

module.exports = router