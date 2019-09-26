const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Add general journal transactions
router.post("/general-journal", auth, (req, res) => {
  let { data } = req.body
  const mapData = data.map(data => {
    if (data.debit.length < 1) {
      data.debit = null
    }
    if (data.credit.length < 1) {
      data.credit = null
    }
    return data
  })
  db.TransactionRecord.bulkCreate(mapData, { returning: true })
    .then(transactions => res.json(transactions))
    .catch(err => { res.status(400).json({ msg: 'Error', err }) })
})

// Add CRB transactions
router.post("/cash-receipts", auth, (req, res) => {
  let { data } = req.body
  db.TransactionRecord.bulkCreate(data, { returning: true })
    .then(transactions => res.json(transactions))
    .catch(err => { res.status(400).json({ msg: 'Error', err }) })
})

// Add CDB transactions
router.post("/cash-disbursements", auth, (req, res) => {
  let { data } = req.body
  db.TransactionRecord.bulkCreate(data, { returning: true })
    .then(transactions => res.json(transactions))
    .catch(err => { res.status(400).json({ msg: 'Error', err }) })
})

// Fetch all transaction records
router.get("/transactions", auth, (req, res) => {
  db.sequelize.query("select \"TransId\", memo, \"date\", num\n" +
    "from \"TransactionRecords\"\n" +
    "group by \"TransId\", memo, date, num\n" +
    "order by \"date\" desc", {
    model: db.TransactionRecord
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction records by bookId
router.get("/transactions/:bookId", auth, (req, res) => {
  const bookId = req.params.bookId

  db.sequelize.query("select \"TransId\", memo, \"date\", num\n" +
    "from \"TransactionRecords\"\n" +
    "where \"BookId\" = :bookId\n" +
    "group by \"TransId\", memo, date, num\n" +
    "order by \"date\" desc", {
    model: db.TransactionRecord,
    replacements: { bookId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction records by TransId
router.get("/transactions/trans_id/:transId", auth, (req, res) => {
  const transId = req.params.transId

  db.sequelize.query("select tr.id, tr.\"date\" as date, tr.num as num, tr.memo as memo, a.name as name, coalesce(tr.debit, 0) as debit, coalesce(tr.credit, 0) as credit\n" +
    "from \"TransactionRecords\" tr inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
    "where \"TransId\" = :transId\n" +
    "order by tr.id asc", {
    model: db.TransactionRecord,
    replacements: { transId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

module.exports = router