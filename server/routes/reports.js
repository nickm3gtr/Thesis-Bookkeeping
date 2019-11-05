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
          "tr.credit as credit, tr.tags as tags, tr.sub->'name' as sub \n" +
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
          "tr.credit as credit, tr.tags as tags, tr.sub->'name' as sub \n" +
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
      .query("select ty.id, tr.\"AccountId\", a.name, tr.sub->'name' as sub, sum(tr.debit) as debit, sum(tr.credit) as credit,\n" +
                    "coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
              "from \"Transactions\" t inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\"\n" +
                  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
                  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                  "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
              "where t.\"date\" between :start and :end\n" +
              "group by tr.sub, a.name, tr.\"AccountId\", ty.id\n" +
              "order by tr.\"AccountId\" asc", {
        model: db.TransactionRecord,
        replacements: { start, end, id }
      })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize
      .query("select ty.id, tr.\"AccountId\", a.name, tr.sub->'name' as sub, sum(tr.debit) as debit, sum(tr.credit) as credit,\n" +
                    "coalesce(sum(tr.debit), 0)-coalesce(sum(tr.credit), 0) as balance\n" +
              "from \"Bookkeepers\" b inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\"\n" +
                  "inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
                  "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                  "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
              "where t.\"date\" between :start and :end and b.\"BranchId\"=:id\n" +
              "group by tr.sub, a.name, tr.\"AccountId\", ty.id\n" +
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
    db.sequelize.query("select ty.\"name\" as type, s.\"name\" as subtype, a.\"name\" as account, tr.sub->'name' as sub, sum(coalesce(tr.debit, 0))- sum(coalesce(tr.credit, 0)) as balance \n" +
      "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" \n" +
        "inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
        "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id  \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.\"date\" between :start and :end \n" +
      "group by tr.sub, a.\"name\", s.\"name\", ty.\"name\", a.id \n" +
      "order by a.id", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select ty.\"name\" as type, s.\"name\" as subtype, a.\"name\" as account, tr.sub->'name' as sub, sum(coalesce(tr.debit, 0))- sum(coalesce(tr.credit, 0)) as balance \n" +
      "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" \n" +
        "inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
        "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id  \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.\"date\" between :start and :end and br.id=:id \n" +
      "group by tr.sub, a.\"name\", s.\"name\", ty.\"name\", a.id \n" +
      "order by a.id", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    })
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
});

// Get Income Statement report
router.get("/income-statement/:id/:start/:end", auth, (req, res) => {
  const { id, start, end } = req.params

  if (id == 0) {
    db.sequelize.query("select ty.id as id, s.id as \"subtypeId\", s.\"name\" as subtype, a.\"name\" as account, tr.sub->'name' as sub, sum(coalesce(tr.debit, 0))- sum(coalesce(tr.credit, 0)) as balance \n" +
      "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" \n" +
        "inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
        "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id  \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.\"date\" between :start and :end and ty.id>=40000 and ty.id<=80000 \n" +
      "group by tr.sub, a.\"name\", s.\"name\", ty.\"name\", a.id, ty.id, s.id \n" +
      "order by a.id", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))

  } else {
    db.sequelize.query("select ty.id as id, s.id as \"subtypeId\", s.\"name\" as subtype, a.\"name\" as account, tr.sub->'name' as sub, sum(coalesce(tr.debit, 0))- sum(coalesce(tr.credit, 0)) as balance \n" +
      "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" \n" +
        "inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
        "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id  \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.\"date\" between :start and :end and br.id=:id  and ty.id>=40000 and ty.id<=80000 \n" +
      "group by tr.sub, a.\"name\", s.\"name\", ty.\"name\", a.id, ty.id, s.id \n" +
      "order by a.id", {
      model: db.TransactionRecord,
      replacements: { id, start, end }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
})

//Get Balance Sheet report
router.get("/balance-sheet/:id/:date", auth, (req, res) => {
  const { id, date } = req.params

  if (id == 0) {
    db.sequelize.query("select ty.id as id, s.id as \"subtypeId\", s.\"name\" as subtype, a.\"name\" as account, tr.sub->'name' as sub, sum(coalesce(tr.debit, 0))- sum(coalesce(tr.credit, 0)) as balance \n" +
      "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" \n" +
        "inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
        "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id  \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.\"date\" <=:date and ty.id>=10000 and ty.id<40000 \n" +
      "group by tr.sub, a.\"name\", s.\"name\", ty.\"name\", a.id, ty.id, s.id \n" +
      "order by a.id", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select ty.id as id, s.id as \"subtypeId\", s.\"name\" as subtype, a.\"name\" as account, tr.sub->'name' as sub, sum(coalesce(tr.debit, 0))- sum(coalesce(tr.credit, 0)) as balance \n" +
      "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" \n" +
        "inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
        "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id  \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.\"date\" <=:date and br.id=:id  and ty.id>=10000 and ty.id<40000 \n" +
      "group by tr.sub, a.\"name\", s.\"name\", ty.\"name\", a.id, ty.id, s.id \n" +
      "order by a.id", {
      model: db.TransactionRecord,
      replacements: { id, date }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
})

// Get Net Profit/Loss for balance sheet
router.get("/net-profit/:id/:year/:date", auth, (req, res) => {
  const { id, date, year } = req.params
  let startDate = `${year}-1-1`
  if (id == 0) {
    db.sequelize.query("select ty.id as id, s.id as \"subtypeId\", s.\"name\" as subtype, a.\"name\" as account, tr.sub->'name' as sub, sum(coalesce(tr.debit, 0))- sum(coalesce(tr.credit, 0)) as balance \n" +
      "from \"Branches\" as br inner join \"Bookkeepers\" b on br.id=b.\"BranchId\" inner join \"Transactions\" t on b.id=t.\"BookkeeperId\" \n" +
        "inner join \"TransactionRecords\" tr on t.id=tr.\"TransId\" inner join \"Accounts\" a on tr.\"AccountId\"=a.id \n" +
        "inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id  \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where t.\"date\" between :startDate and :date and ty.id>=40000 and ty.id<=80000 \n" +
      "group by tr.sub, a.\"name\", s.\"name\", ty.\"name\", a.id, ty.id, s.id \n" +
      "order by a.id", {
      model: db.TransactionRecord,
      replacements: { id, date, startDate }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select ty.name as type, s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (\n" +
                          "select sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0))\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                          "where tr.\"AccountId\"=a.id and t.\"date\" between :startDate and :date and b.\"BranchId\"=:id\n" +
                        ") as balance\n" +
                        "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id\n" +
                            "inner join \"Types\" ty on s.\"TypeId\"=ty.id\n" +
                        "where a.id in (\n" +
                          "select tr.\"AccountId\"\n" +
                          "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
                            "where ty.id >=40000 and ty.id < 80000 and t.\"date\" between :startDate and :date and b.\"BranchId\"=:id\n" +
                        ")", {
      model: db.TransactionRecord,
      replacements: { id, date, startDate }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
})

router.get('/notes/:id/:first/:second', auth, (req, res) => {
  const { id, first, second } = req.params
  let yearOneStart = 0
  let yearOneEnd = 0
  let yearTwoStart = 0
  let yearTwoEnd = 0
  if (first < second) {
    yearOneStart = `${first}-1-1`
    yearOneEnd = `${first}-12-31`
    yearTwoStart = `${second}-1-1`
    yearTwoEnd = `${second}-12-31`
  } else {
    yearOneStart = `${second}-1-1`
    yearOneEnd = `${second}-12-31`
    yearTwoStart = `${first}-1-1`
    yearTwoEnd = `${first}-12-31`
  }

  if (id == 0) {
    db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
        "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" <= :yearOneEnd \n" +
      ") as balance1, ( \n" +
      "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" <= :yearTwoEnd \n" +
      ") as balance2 \n" +
      "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
          "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where a.id in ( \n" +
        "select tr.\"AccountId\" \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where ty.id >=10000 and ty.id < 40000 and t.\"date\" <= :yearTwoEnd \n" +
      ") \n" +
      "union all \n" +
    "select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
        "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" between :yearOneStart and :yearOneEnd \n" +
      ") as balance1, ( \n" +
      "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" between :yearTwoStart and :yearTwoEnd \n" +
      ") as balance2 \n" +
      "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
          "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where a.id in ( \n" +
        "select tr.\"AccountId\" \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where ty.id >=40000 and ty.id < 80000 and t.\"date\" between :yearOneStart and :yearTwoEnd \n" +
      ")", {
        model: db.TransactionRecord,
        replacements: { id, yearOneStart, yearOneEnd, yearTwoStart, yearTwoEnd }
      }).then(transactions => res.json(transactions))
        .catch(err => res.status(400).json({ msg: err }))
  } else {
      db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
      "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
      "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
      "where tr.\"AccountId\"=a.id and t.\"date\" <= :yearOneEnd and b.\"BranchId\"=:id \n" +
    ") as balance1, ( \n" +
    "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
      "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
      "where tr.\"AccountId\"=a.id and t.\"date\" <= :yearTwoEnd and b.\"BranchId\"=:id \n" +
    ") as balance2 \n" +
    "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
    "where a.id in ( \n" +
      "select tr.\"AccountId\" \n" +
      "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
      "where ty.id >=10000 and ty.id < 40000 and t.\"date\" <= :yearTwoEnd and b.\"BranchId\"=:id \n" +
    ") \n" +
    "union all \n" +
  "select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
      "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
      "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
      "where tr.\"AccountId\"=a.id and t.\"date\" between :yearOneStart and :yearOneEnd and b.\"BranchId\"=:id \n" +
    ") as balance1, ( \n" +
    "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
      "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
      "where tr.\"AccountId\"=a.id and t.\"date\" between :yearTwoStart and :yearTwoEnd and b.\"BranchId\"=:id \n" +
    ") as balance2 \n" +
    "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
        "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
    "where a.id in ( \n" +
      "select tr.\"AccountId\" \n" +
      "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
      "where ty.id >=40000 and ty.id < 80000 and t.\"date\" between :yearOneStart and :yearTwoEnd and b.\"BranchId\"=:id \n" +
    ")", {
      model: db.TransactionRecord,
      replacements: { id, yearOneStart, yearOneEnd, yearTwoStart, yearTwoEnd }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }

  
})

// Get net profit for BALANCE SHEET summary REPORT
router.get('/summary/net-profit/:id/:first/:second', auth, (req, res) => {
  const { id, first, second } = req.params
  let yearOneStart = 0
  let yearOneEnd = 0
  let yearTwoStart = 0
  let yearTwoEnd = 0
  if (first < second) {
    yearOneStart = `${first}-1-1`
    yearOneEnd = `${first}-12-31`
    yearTwoStart = `${second}-1-1`
    yearTwoEnd = `${second}-12-31`
  } else {
    yearOneStart = `${second}-1-1`
    yearOneEnd = `${second}-12-31`
    yearTwoStart = `${first}-1-1`
    yearTwoEnd = `${first}-12-31`
  }

  if (id == 0) {
    db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
        "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" between :yearOneStart and :yearOneEnd \n" +
      ") as balance1, ( \n" +
      "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" between :yearTwoStart and :yearTwoEnd \n" +
      ") as balance2 \n" +
      "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
          "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where a.id in ( \n" +
        "select tr.\"AccountId\" \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id \n" +
        "where ty.id >=40000 and ty.id < 80000 and t.\"date\" between :yearOneStart and :yearTwoEnd \n" +
      ")", {
        model: db.TransactionRecord,
        replacements: { id, yearOneStart, yearOneEnd, yearTwoStart, yearTwoEnd }
      }).then(transactions => res.json(transactions))
        .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, ( \n" +
        "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" between :yearOneStart and :yearOneEnd and b.\"BranchId\"=:id  \n" +
      ") as balance1, ( \n" +
      "select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
        "where tr.\"AccountId\"=a.id and t.\"date\" between :yearTwoStart and :yearTwoEnd and b.\"BranchId\"=:id  \n" +
      ") as balance2 \n" +
      "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
          "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
      "where a.id in ( \n" +
        "select tr.\"AccountId\" \n" +
        "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
        "where ty.id >=40000 and ty.id < 80000 and t.\"date\" between :yearOneStart and :yearTwoEnd and b.\"BranchId\"=:id  \n" +
      ")", {
        model: db.TransactionRecord,
        replacements: { id, yearOneStart, yearOneEnd, yearTwoStart, yearTwoEnd }
      }).then(transactions => res.json(transactions))
        .catch(err => res.status(400).json({ msg: err }))
  }

  
})

router.get('/distribute/:id/:year', auth, (req, res) => {
  const { id, year } = req.params
  let start = `${year}-1-1`
  let end = `${year}-12-31`
  db.sequelize.query("select ty.name as type, s.id as \"subtypeId\", s.\"name\" as subtype, ty.id as id, a.id as \"account_id\", a.\"name\" as account, (select coalesce(sum(coalesce(tr.debit, 0)) - sum(coalesce(tr.credit, 0)), 0) \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
    "where tr.\"AccountId\"=a.id and t.\"date\" between :start and :end and b.\"BranchId\"=:id \n" +
  ") as balance \n" +
  "from \"Accounts\" a inner join \"SubTypes\" s on a.\"SubTypeId\"=s.id \n" +
      "inner join \"Types\" ty on s.\"TypeId\"=ty.id \n" +
  "where a.id in ( \n" +
    "select tr.\"AccountId\" \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id  \n" +
    "where ty.id >=40000 and ty.id < 80000 and t.\"date\" between :start and :end and b.\"BranchId\"=:id \n" +
  ")", {
    model: db.TransactionRecord,
    replacements: { id, year, start, end }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: err }))
})

router.get('/check-distribute/:id/:year', auth, (req, res) => {
  const { id, year } = req.params
  if (id == 0) {
    db.sequelize.query("select t.id as id, count(tr.\"AccountId\") as count \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id inner join \"Branches\" br on b.\"BranchId\"=br.id \n" +
    "where tr.\"AccountId\" in (149,150, 151, 152, 153, 154) \n" +
    "group by t.id \n" +
    "having extract(year from t.date) = :year", {
      model: db.TransactionRecord,
      replacements: { id, year }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  } else {
    db.sequelize.query("select t.id as id, count(tr.\"AccountId\") as count \n" +
    "from \"TransactionRecords\" tr inner join \"Transactions\" t on tr.\"TransId\"=t.id inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id inner join \"Branches\" br on b.\"BranchId\"=br.id \n" +
    "where tr.\"AccountId\" in (149,150, 151, 152, 153, 154) and br.id=:id \n" +
    "group by t.id \n" +
    "having extract(year from t.date) = :year", {
      model: db.TransactionRecord,
      replacements: { id, year }
    }).then(transactions => res.json(transactions))
      .catch(err => res.status(400).json({ msg: err }))
  }
  
})

module.exports = router;
