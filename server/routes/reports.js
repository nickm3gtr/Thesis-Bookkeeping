const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// GET journal report
router.get("/journal/:id/:bookId/:start/:end", (req, res) => {
  // const { start, end } = req.query
  const bookId = req.params.bookId
  const start = req.params.start;
  const end = req.params.end;
  const id = req.params.id;
  db.sequelize.query("select tr.id as id, tr.\"date\" as date, tr.\"num\" as num, tr.memo as memo, tr.\"AccountId\" as account_id, a.name as AccountName, tr.debit as debit, tr.credit as credit, tr.\"tags\" as tags\n" +
    "from  \"Bookkeepers\" b inner join \"TransactionRecords\" tr on b.id=tr.\"BookkeeperId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
    "where date between :start and :end and b.\"BranchId\"=:id and tr.\"BookId\"=:bookId\n" +
    "order by tr.id", {
    model: db.TransactionRecord,
    replacements: { id, start, end, bookId }
  })
    .then(journals => res.json(journals))
    .catch(err =>
      res.status(400).json({ msg: "Error fetching journals", err })
    );
});

// Get Ledger Report
router.get("/ledger/:id/:start/:end", (req, res) => {
  const { id, start, end } = req.params
  db.sequelize
    .query("select t.id, tr.\"AccountId\", a.\"name\", sum(tr.debit) as debit, sum(tr.credit) as credit, coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
      "from \"Bookkeepers\" b inner join \"TransactionRecords\" tr on b.id=tr.\"BookkeeperId\" inner join \"Accounts\" a on tr.\"AccountId\" = a.id inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" t on s.\"TypeId\"=t.id \n" +
      "where b.\"BranchId\"=:id and tr.\"date\" between :start and :end\n" +
      "group by a.\"name\", tr.\"AccountId\", t.id\n" +
      "order by tr.\"AccountId\" asc", {
      model: db.TransactionRecord,
      replacements: { start, end, id }
    })
    .then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: err }))
});

router.get("/trial-balance/:id/:start/:end", (req, res) => {
  const { id, start, end } = req.params

  db.sequelize.query("select tr.name as type, s.name as subtype, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
    "    from \"TransactionRecords\" t inner join \"Bookkeepers\" b on  t.\"BookkeeperId\"=b.id\n" +
    "    where \"AccountId\"=a.id and \"date\" between :start and :end and b.\"BranchId\"=:id) as balance\n" +
    "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
    "    where a.id in (select \"AccountId\" from \"TransactionRecords\")", {
    model: db.TransactionRecord,
    replacements: { id, start, end }
  })
    .then(transactions => res.json(transactions))
});

module.exports = router;
