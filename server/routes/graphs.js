const express = require("express");
const router = express.Router();
const db = require("../models");

// Get sales by month
router.get("/sales/:id/:start/:end", (req, res) => {
  const { id, start, end } = req.params

  db.sequelize.query("select month, sum(balance) as balance\n" +
    "from (select extract(month from date) as month, credit, debit, sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) as balance\n" +
    "    from \"TransactionRecords\" tr inner join \"Bookkeepers\" b on  tr.\"BookkeeperId\"=b.id\n" +
    "    where \"date\" between :start and :end and b.\"BranchId\"=:id and \"AccountId\" >= 40000 and \"AccountId\" < 50000\n" +
    "    group by date, credit, debit\n" +
    "    order by date asc) as salesByMonth\n" +
    "group by month", {
    model: db.TransactionRecord,
    replacements: { id, start, end }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: err }))
})

// Get expenses by month
router.get("/expenses/:id/:start/:end", (req, res) => {
  const { id, start, end } = req.params

  db.sequelize.query("select month, sum(balance) as balance\n" +
    "from (select extract(month from date) as month, credit, debit, sum(coalesce(debit, 0)) - sum(coalesce(credit, 0)) as balance\n" +
    "    from \"TransactionRecords\" tr inner join \"Bookkeepers\" b on  tr.\"BookkeeperId\"=b.id\n" +
    "    where \"date\" between :start and :end and b.\"BranchId\"=:id and \"AccountId\" >= 70000 and \"AccountId\" < 80000\n" +
    "    group by date, credit, debit\n" +
    "    order by date asc) as salesByMonth\n" +
    "group by month", {
    model: db.TransactionRecord,
    replacements: { id, start, end }
  }).then(sales => res.json(sales))
    .catch(err => res.status(400).json({ msg: err }))
})

module.exports = router