const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// GET journal report
router.get("/journal/:id/:start/:end", (req, res) => {
  // const { start, end } = req.query
  const start = req.params.start;
  const end = req.params.end;
  const id = req.params.id;
  // const branchId = req.params.branchId
  db.TransactionRecord.findAll({
    include: [
      {
        model: db.Account
      },
      {
        model: db.Bookkeeper,
        include: [{ model: db.Branch }]
      }
    ],
    where: {
      BookkeeperId: id,
      date: {
        [Op.gte]: start,
        [Op.lte]: end
      }
    },
    order: ["id"]
  })
    .then(journals => res.json(journals))
    .catch(err =>
      res.status(400).json({ msg: "Error fetching journals", err })
    );
});

// Get Ledger Report
router.get("/ledger/:id/:date", (req, res) => {
  const { id, date } = req.params
  db.sequelize
    .query("select t.id, tr.\"AccountId\", a.\"name\", sum(tr.debit) as debit, sum(tr.credit) as credit, coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
      "from \"TransactionRecords\" tr inner join \"Accounts\" a on tr.\"AccountId\" = a.id inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" t on s.\"TypeId\"=t.id \n" +
      "where tr.\"BookkeeperId\"=:id and tr.\"date\" <= :date\n" +
      "group by a.\"name\", tr.\"AccountId\", t.id\n" +
      "order by tr.\"AccountId\" asc", {
      model: db.TransactionRecord,
      replacements: { date, id }
    })
    .then(transactions => res.json(transactions));
});

module.exports = router;
