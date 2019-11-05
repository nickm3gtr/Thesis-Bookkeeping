const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require('../middleware/auth')

// Get sales by month
router.get("/sales/:id/:year", auth, (req, res) => {
  const { id, year } = req.params

  db.sequelize.query("with TransactionBalance(january, february, march, april, may, june, july, august, september, october, november, december) as\n" +
    "(\t\n" +
    "\tselect\n" +
    "\t\tcase when extract(month from t.date) = 1 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as January,\n" +
    "\t\tcase when extract(month from t.date) = 2 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as February,\n" +
    "\t\tcase when extract(month from t.date) = 3 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as March,\n" +
    "\t\tcase when extract(month from t.date) = 4 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as April,\n" +
    "\t\tcase when extract(month from t.date) = 5 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as May,\n" +
    "\t\tcase when extract(month from t.date) = 6 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as June,\n" +
    "\t\tcase when extract(month from t.date) = 7 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as July,\n" +
    "\t\tcase when extract(month from t.date) = 8 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as August,\n" +
    "\t\tcase when extract(month from t.date) = 9 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as September,\n" +
    "\t\tcase when extract(month from t.date) = 10 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as October,\n" +
    "\t\tcase when extract(month from t.date) = 11 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as November,\n" +
    "\t\tcase when extract(month from t.date) = 12 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as December\n" +
    "\tfrom \"Types\" ty inner join \"SubTypes\" s on ty.id=s.\"TypeId\" \n" +
    "\t\t inner join \"Accounts\" a on s.id=a.\"SubTypeId\" \n" +
    "\t\t inner join \"TransactionRecords\" tr on a.id=tr.\"AccountId\" inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "\twhere ty.id = 40000 and extract(year from t.date) = :year and b.\"BranchId\"=:id\n" +
    "\tgroup by t.date, credit, debit\n" +
    ")\n" +
    "select sum(january) as january, sum(february) as february, sum(march) as march, sum(april) as april,\n" +
    "\t\tsum(may) as may, sum(june) as june, sum(july) as july, sum(august) as august, sum(september) as september,\n" +
    "\t\tsum(october) as october, sum(november) as november, sum(december) as december\n" +
    "from TransactionBalance", {
    model: db.TransactionRecord,
    replacements: { id, year }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get expenses by month
router.get("/expenses/:id/:year", auth, (req, res) => {
  const { id, year } = req.params

  db.sequelize.query("with TransactionBalance(january, february, march, april, may, june, july, august, september, october, november, december) as\n" +
    "(\t\n" +
    "\tselect\n" +
    "\t\tcase when extract(month from t.date) = 1 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as January,\n" +
    "\t\tcase when extract(month from t.date) = 2 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as February,\n" +
    "\t\tcase when extract(month from t.date) = 3 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as March,\n" +
    "\t\tcase when extract(month from t.date) = 4 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as April,\n" +
    "\t\tcase when extract(month from t.date) = 5 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as May,\n" +
    "\t\tcase when extract(month from t.date) = 6 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as June,\n" +
    "\t\tcase when extract(month from t.date) = 7 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as July,\n" +
    "\t\tcase when extract(month from t.date) = 8 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as August,\n" +
    "\t\tcase when extract(month from t.date) = 9 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as September,\n" +
    "\t\tcase when extract(month from t.date) = 10 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as October,\n" +
    "\t\tcase when extract(month from t.date) = 11 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as November,\n" +
    "\t\tcase when extract(month from t.date) = 12 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as December\n" +
    "\tfrom \"Types\" ty inner join \"SubTypes\" s on ty.id=s.\"TypeId\" \n" +
    "\t\t inner join \"Accounts\" a on s.id=a.\"SubTypeId\" \n" +
    "\t\t inner join \"TransactionRecords\" tr on a.id=tr.\"AccountId\" inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "\twhere ty.id = 70000 and extract(year from t.date) = :year and b.\"BranchId\"=:id\n" +
    "\tgroup by t.date, credit, debit\n" +
    ")\n" +
    "select sum(january) as january, sum(february) as february, sum(march) as march, sum(april) as april,\n" +
    "\t\tsum(may) as may, sum(june) as june, sum(july) as july, sum(august) as august, sum(september) as september,\n" +
    "\t\tsum(october) as october, sum(november) as november, sum(december) as december\n" +
    "from TransactionBalance", {
    model: db.TransactionRecord,
    replacements: { id, year }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get admin overall sales by month
router.get("/admin/sales/:year", auth, (req, res) => {
  const { year } = req.params

  db.sequelize.query("with TransactionBalance(january, february, march, april, may, june, july, august, september, october, november, december) as\n" +
    "(\t\n" +
    "\tselect\n" +
    "\t\tcase when extract(month from t.date) = 1 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as January,\n" +
    "\t\tcase when extract(month from t.date) = 2 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as February,\n" +
    "\t\tcase when extract(month from t.date) = 3 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as March,\n" +
    "\t\tcase when extract(month from t.date) = 4 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as April,\n" +
    "\t\tcase when extract(month from t.date) = 5 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as May,\n" +
    "\t\tcase when extract(month from t.date) = 6 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as June,\n" +
    "\t\tcase when extract(month from t.date) = 7 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as July,\n" +
    "\t\tcase when extract(month from t.date) = 8 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as August,\n" +
    "\t\tcase when extract(month from t.date) = 9 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as September,\n" +
    "\t\tcase when extract(month from t.date) = 10 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as October,\n" +
    "\t\tcase when extract(month from t.date) = 11 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as November,\n" +
    "\t\tcase when extract(month from t.date) = 12 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as December\n" +
    "\tfrom \"Types\" ty inner join \"SubTypes\" s on ty.id=s.\"TypeId\" \n" +
    "\t\t inner join \"Accounts\" a on s.id=a.\"SubTypeId\" \n" +
    "\t\t inner join \"TransactionRecords\" tr on a.id=tr.\"AccountId\" inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "\twhere ty.id = 40000 and extract(year from t.date) = :year\n" +
    "\tgroup by t.date, credit, debit\n" +
    ")\n" +
    "select sum(january) as january, sum(february) as february, sum(march) as march, sum(april) as april,\n" +
    "\t\tsum(may) as may, sum(june) as june, sum(july) as july, sum(august) as august, sum(september) as september,\n" +
    "\t\tsum(october) as october, sum(november) as november, sum(december) as december\n" +
    "from TransactionBalance", {
    model: db.TransactionRecord,
    replacements: { year }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Get admin overall expenses by month
router.get("/admin/expenses/:year", auth, (req, res) => {
  const { year } = req.params

  db.sequelize.query("with TransactionBalance(january, february, march, april, may, june, july, august, september, october, november, december) as\n" +
    "(\t\n" +
    "\tselect\n" +
    "\t\tcase when extract(month from t.date) = 1 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as January,\n" +
    "\t\tcase when extract(month from t.date) = 2 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as February,\n" +
    "\t\tcase when extract(month from t.date) = 3 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as March,\n" +
    "\t\tcase when extract(month from t.date) = 4 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as April,\n" +
    "\t\tcase when extract(month from t.date) = 5 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as May,\n" +
    "\t\tcase when extract(month from t.date) = 6 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as June,\n" +
    "\t\tcase when extract(month from t.date) = 7 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as July,\n" +
    "\t\tcase when extract(month from t.date) = 8 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as August,\n" +
    "\t\tcase when extract(month from t.date) = 9 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as September,\n" +
    "\t\tcase when extract(month from t.date) = 10 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as October,\n" +
    "\t\tcase when extract(month from t.date) = 11 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as November,\n" +
    "\t\tcase when extract(month from t.date) = 12 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as December\n" +
    "\tfrom \"Types\" ty inner join \"SubTypes\" s on ty.id=s.\"TypeId\" \n" +
    "\t\t inner join \"Accounts\" a on s.id=a.\"SubTypeId\" \n" +
    "\t\t inner join \"TransactionRecords\" tr on a.id=tr.\"AccountId\" inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "\twhere ty.id = 70000 and extract(year from t.date) = :year\n" +
    "\tgroup by t.date, credit, debit\n" +
    ")\n" +
    "select sum(january) as january, sum(february) as february, sum(march) as march, sum(april) as april,\n" +
    "\t\tsum(may) as may, sum(june) as june, sum(july) as july, sum(august) as august, sum(september) as september,\n" +
    "\t\tsum(october) as october, sum(november) as november, sum(december) as december\n" +
    "from TransactionBalance", {
    model: db.TransactionRecord,
    replacements: { year }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

module.exports = router