const express = require("express");
const router = express.Router();
const db = require("../models");

// Get sales by month
router.get("/sales/:id/:year", (req, res) => {
  const { id, year } = req.params

  db.sequelize.query("with TransactionBalance(january, february, march, april, may, june, july, august, september, october, november, december) as\n" +
    "(\t\n" +
    "\tselect\n" +
    "\t\tcase when extract(month from date) = 1 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as January,\n" +
    "\t\tcase when extract(month from date) = 2 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as February,\n" +
    "\t\tcase when extract(month from date) = 3 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as March,\n" +
    "\t\tcase when extract(month from date) = 4 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as April,\n" +
    "\t\tcase when extract(month from date) = 5 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as May,\n" +
    "\t\tcase when extract(month from date) = 6 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as June,\n" +
    "\t\tcase when extract(month from date) = 7 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as July,\n" +
    "\t\tcase when extract(month from date) = 8 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as August,\n" +
    "\t\tcase when extract(month from date) = 9 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as September,\n" +
    "\t\tcase when extract(month from date) = 10 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as October,\n" +
    "\t\tcase when extract(month from date) = 11 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as November,\n" +
    "\t\tcase when extract(month from date) = 12 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as December\n" +
    "\tfrom \"TransactionRecords\"\n" +
    "\twhere \"AccountId\" >= 40000 and \"AccountId\" < 50000 and extract(year from date) = :year and \"BranchId\"=:id\n" +
    "\tgroup by date, credit, debit\n" +
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
router.get("/expenses/:id/:year", (req, res) => {
  const { id, year } = req.params

  db.sequelize.query("with TransactionBalance(january, february, march, april, may, june, july, august, september, october, november, december) as\n" +
    "(\t\n" +
    "\tselect\n" +
    "\t\tcase when extract(month from date) = 1 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as January,\n" +
    "\t\tcase when extract(month from date) = 2 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as February,\n" +
    "\t\tcase when extract(month from date) = 3 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as March,\n" +
    "\t\tcase when extract(month from date) = 4 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as April,\n" +
    "\t\tcase when extract(month from date) = 5 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as May,\n" +
    "\t\tcase when extract(month from date) = 6 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as June,\n" +
    "\t\tcase when extract(month from date) = 7 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as July,\n" +
    "\t\tcase when extract(month from date) = 8 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as August,\n" +
    "\t\tcase when extract(month from date) = 9 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as September,\n" +
    "\t\tcase when extract(month from date) = 10 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as October,\n" +
    "\t\tcase when extract(month from date) = 11 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as November,\n" +
    "\t\tcase when extract(month from date) = 12 \n" +
    "\t\tthen  sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) else 0 \n" +
    "\t\tend as December\n" +
    "\tfrom \"TransactionRecords\"\n" +
    "\twhere \"AccountId\" >= 70000 and \"AccountId\" < 80000 and extract(year from date) = :year and \"BranchId\"=:id\n" +
    "\tgroup by date, credit, debit\n" +
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

module.exports = router