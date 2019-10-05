const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require("../middleware/auth")

// GET journal report
router.get("/journal/:id/:bookId/:start/:end", auth, (req, res) => {
  const bookId = req.params.bookId
  const start = req.params.start;
  const end = req.params.end;
  const id = req.params.id;
  if (id == 0) {
    db.sequelize.query("select tr.id as id, tr.\"date\" as date, tr.\"num\" as num, tr.memo as memo, tr.\"AccountId\" as account_id, a.name as AccountName, tr.debit as debit, tr.credit as credit, tr.\"tags\" as tags\n" +
      "from  \"Branches\" b inner join \"TransactionRecords\" tr on b.id=tr.\"BranchId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
      "where date between :start and :end and tr.\"BookId\"=:bookId\n" +
      "order by tr.id", {
      model: db.TransactionRecord,
      replacements: { id, start, end, bookId }
    })
      .then(journals => res.json(journals))
      .catch(err =>
        res.status(400).json({ msg: "Error fetching journals", err })
      );
  } else {
    db.sequelize.query("select tr.id as id, tr.\"date\" as date, tr.\"num\" as num, tr.memo as memo, tr.\"AccountId\" as account_id, a.name as AccountName, tr.debit as debit, tr.credit as credit, tr.\"tags\" as tags\n" +
      "from  \"Branches\" b inner join \"TransactionRecords\" tr on b.id=tr.\"BranchId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
      "where date between :start and :end and b.\"id\"=:id and tr.\"BookId\"=:bookId\n" +
      "order by tr.id", {
      model: db.TransactionRecord,
      replacements: { id, start, end, bookId }
    })
      .then(journals => res.json(journals))
      .catch(err =>
        res.status(400).json({ msg: "Error fetching journals", err })
      );
  }
});

// Get Ledger Report
router.get("/ledger/:id/:start/:end", auth, (req, res) => {
  const { id, start, end } = req.params
  if (id == 0) {
    db.sequelize
      .query("select t.id, tr.\"AccountId\", a.\"name\", sum(tr.debit) as debit, sum(tr.credit) as credit, coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
        "from \"Branches\" b inner join \"TransactionRecords\" tr on b.id=tr.\"BranchId\" inner join \"Accounts\" a on tr.\"AccountId\" = a.id inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" t on s.\"TypeId\"=t.id \n" +
        "where tr.\"date\" between :start and :end\n" +
        "group by a.\"name\", tr.\"AccountId\", t.id\n" +
        "order by tr.\"AccountId\" asc", {
        model: db.TransactionRecord,
        replacements: { start, end, id }
      })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize
      .query("select t.id, tr.\"AccountId\", a.\"name\", sum(tr.debit) as debit, sum(tr.credit) as credit, coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
        "from \"Branches\" b inner join \"TransactionRecords\" tr on b.id=tr.\"BranchId\" inner join \"Accounts\" a on tr.\"AccountId\" = a.id inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" t on s.\"TypeId\"=t.id \n" +
        "where b.\"id\"=:id and tr.\"date\" between :start and :end\n" +
        "group by a.\"name\", tr.\"AccountId\", t.id\n" +
        "order by tr.\"AccountId\" asc", {
        model: db.TransactionRecord,
        replacements: { start, end, id }
      })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
});

router.get("/trial-balance/:id/:start/:end", auth, (req, res) => {
  const { id, start, end } = req.params

  if (id == 0) {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" between :start and :end) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select t.\"AccountId\" \n" +
      "from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "where t.\"date\" between :start and :end)", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" between :start and :end and b.\"id\"=:id) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select t.\"AccountId\" \n" +
      "from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "where t.\"date\" between :start and :end and b.\"id\"=:id)", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
});

// Get Income Statement report
router.get("/income-statement/:id/:start/:end", (req, res) => {
  const { id, start, end } = req.params

  if (id == 0) {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.id as id, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" between :start and :end) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select t.\"AccountId\" \n" +
      "from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "where t.\"AccountId\" >= 40000 and \"AccountId\" <= 80000 and t.\"date\" between :start and :end)", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))

  } else {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.id as id, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" between :start and :end and b.\"id\"=:id) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select t.\"AccountId\" \n" +
      "from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "where t.\"AccountId\" >= 40000 and \"AccountId\" <= 80000 and t.\"date\" between :start and :end and b.\"id\"=:id)", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
})

//Get Balance Sheet report
router.get("/balance-sheet/:id/:date", (req, res) => {
  const { id, date } = req.params

  if (id == 0) {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.id as id, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" <= :date) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select \"AccountId\" \n" +
      "    \t\t\t\t\tfrom \"TransactionRecords\" tr inner join \"Branches\" b on tr.\"BranchId\"=b.id\n" +
      "    \t\t\t\t\twhere \"AccountId\" >= 10000 and \"AccountId\" < 40000)", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.id as id, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" <= :date and b.\"id\"=:id) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select \"AccountId\" \n" +
      "    \t\t\t\t\tfrom \"TransactionRecords\" tr inner join \"Branches\" b on tr.\"BranchId\"=b.id\n" +
      "    \t\t\t\t\twhere \"AccountId\" >= 10000 and \"AccountId\" < 40000 and b.\"id\"=:id)", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
})

// Get Net Profit/Loss for balance sheet
router.get("/net-profit/:id/:date", (req, res) => {
  const { id, date } = req.params

  if (id == 0) {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.id as id, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" <= :date) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select t.\"AccountId\" \n" +
      "from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "where t.\"AccountId\" >= 40000 and \"AccountId\" <= 80000 and t.\"date\" <= :date)", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select tr.name as type, s.name as subtype, a.id as id, a.\"name\" as account, (select sum(coalesce(debit, 0)) - sum(coalesce(credit, 0))\n" +
      "    from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "    where \"AccountId\"=a.id and \"date\" <= :date and b.\"id\"=:id) as balance\n" +
      "    from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" tr on s.\"TypeId\"=tr.id\n" +
      "    where a.id in (select t.\"AccountId\" \n" +
      "from \"TransactionRecords\" t inner join \"Branches\" b on  t.\"BranchId\"=b.id\n" +
      "where t.\"AccountId\" >= 40000 and \"AccountId\" <= 80000 and t.\"date\" <= :date and b.\"id\"=:id)", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
})

module.exports = router;
