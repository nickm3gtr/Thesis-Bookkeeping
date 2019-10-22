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
    db.sequelize.query("select t.id as trans_id, tr.id as id, t.\"date\" as \"date\", t.num as num, t.memo as memo,\n" +
          "s.id as account_id, a.\"name\" as AccountName, tr.debit as debit,\n" +
          "tr.credit as credit, tr.tags as tags\n" +
      "from \"Transactions\" t inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\"\n" +
      "inner join \"Accounts\" a on tr.\"AccountId\"=a.id inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.date between :start and :end and t.\"BookId\"=:bookId\n" +
      "order by t.date asc", {
            model: db.TransactionRecord,
            replacements: { id, start, end, bookId }
    })
      .then(journals => res.json(journals))
      .catch(err =>
        res.status(400).json({ msg: "Error fetching journals", err })
      );
  } else {
    db.sequelize.query("select t.id as trans_id, tr.id as id, t.\"date\" as \"date\", t.num as num, t.memo as memo,\n" +
          "s.id as account_id, a.\"name\" as AccountName, tr.debit as debit,\n" +
          "tr.credit as credit, tr.tags as tags\n" +
      "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" \n" +
      "inner join \"Accounts\" a on tr.\"AccountId\"=a.id inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.date between :start and :end and t.\"BookId\"=:bookId and b.\"BranchId\"=:id \n" +
      "order by t.date asc", {
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
      .query("select ty.id, tr.\"AccountId\", a.name, sum(tr.debit) as debit, sum(tr.credit) as credit,\n" +
                    "coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
              "from \"Transactions\" t inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\"\n" +
                  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
                  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                  "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
              "where t.\"date\" between :start and :end\n" +
              "group by a.name, tr.\"AccountId\", ty.id\n" +
              "order by tr.\"AccountId\" asc", {
        model: db.TransactionRecord,
        replacements: { start, end, id }
      })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize
      .query("select ty.id, tr.\"AccountId\", a.name, sum(tr.debit) as debit, sum(tr.credit) as credit,\n" +
                    "coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
              "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\"\n" +
                  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
                  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                  "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
              "where t.\"date\" between :start and :end and b.\"BranchId\"=:id\n" +
              "group by a.name, tr.\"AccountId\", ty.id\n" +
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
    db.sequelize.query("select ty.\"name\" as type, s.name as subtype, a.\"name\" as account, (\n"+
                            "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                            "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                            "where tr.\"AccountId\"=a.id and t.\"date\" between :start and :end\n" +
                          ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                          "where t.\"date\" between :start and :end\n" +
                        ")\n" +
                        "order by ty.id asc", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select ty.\"name\" as type, s.name as subtype, a.\"name\" as account, (\n"+
                            "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                            "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                            "where tr.\"AccountId\"=a.id and t.\"date\" between :start and :end and b.\"BranchId\"=:id\n" +
                          ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                          "where t.\"date\" between :start and :end and b.\"BranchId\"=:id\n" +
                        ")\n" +
                        "order by ty.id asc", {
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
    db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (\n" +
                        "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                        "where tr.\"AccountId\"=a.id and t.\"date\" between :start and :end\n" +
                      ") as balance\n" +
                      "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                          "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                      "where a.id in (\n" +
                        "select tr.\"AccountId\"\n" +
                        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                          "where ty.id >=40000 and ty.id <= 80000 and t.\"date\" between :start and :end\n" +
                      ")", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))

  } else {
    db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (\n" +
                          "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                          "where tr.\"AccountId\"=a.id and t.\"date\" between :start and :end and b.\"BranchId\"=:id\n" +
                        ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                            "where ty.id >=40000 and ty.id <= 80000 and t.\"date\" between :start and :end and b.\"BranchId\"=:id\n" +
                        ")", {
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
    db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (\n" +
                          "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                          "where tr.\"AccountId\"=a.id and t.\"date\" <= :date\n" +
                        ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                            "where ty.id>=10000 and ty.id < 40000 and t.\"date\" <= :date\n" +
                        ")", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select ty.name as type, s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (\n" +
                          "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                          "where tr.\"AccountId\"=a.id and t.\"date\" <= :date and b.\"BranchId\"=:id\n" +
                        ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                            "where ty.id >=10000 and ty.id < 40000 and t.\"date\" <= :date and b.\"BranchId\"=:id\n" +
                        ")", {
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
    db.sequelize.query("select ty.name as type, s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (\n" +
                          "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                          "where tr.\"AccountId\"=a.id and t.\"date\" <= :date\n" +
                        ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id\n" +
                            "where ty.id >=40000 and ty.id < 80000 and t.\"date\" <= :date\n" +
                        ")", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select ty.name as type, s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (\n" +
                          "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                          "where tr.\"AccountId\"=a.id and t.\"date\" <= :date and b.\"BranchId\"=:id\n" +
                        ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                            "where ty.id >=40000 and ty.id < 80000 and t.\"date\" <= :date and b.\"BranchId\"=:id\n" +
                        ")", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
})

router.get('/notes/:id/:start/:end', (req, res) => {
  const { id, start, end } = req.params
  db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
    "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
    "where tr.\"AccountId\"=a.id and t.\"date\" between '2018-1-1' and '2018-10-22' \n" +
  ") as balance1, ( \n" +
   "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
    "where tr.\"AccountId\"=a.id and t.\"date\" between '2018-1-1' and '2019-10-22' \n" +
  ") as balance2 \n" +
  "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
      "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where a.id in ( \n" +
    "select tr.\"AccountId\" \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
    "where ty.id >=10000 and ty.id < 40000 and t.\"date\" between '2018-1-1' and '2019-10-22' \n" +
  ") \n" +
  "union all \n" +
"select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
    "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
    "where tr.\"AccountId\"=a.id and t.\"date\" between '2018-1-1' and '2018-10-22' \n" +
  ") as balance1, ( \n" +
   "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
    "where tr.\"AccountId\"=a.id and t.\"date\" between '2019-1-1' and '2019-10-22' \n" +
  ") as balance2 \n" +
  "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
      "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where a.id in ( \n" +
    "select tr.\"AccountId\" \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
    "where ty.id >=40000 and ty.id < 80000 and t.\"date\" between '2018-1-1' and '2019-10-22' \n" +
  ")", {
    model: db.TransactionRecord,
    replacements: { id, start, end }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: err }))
})

module.exports = router;
