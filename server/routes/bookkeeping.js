/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

router.post("/general-journal", auth, (req, res) => {
  let { BookkeeperId, BookId, num, memo, date, data } = req.body
  const status = 'created'
  const validated = 'unvalidated'
  db.Transaction.create({
    BookkeeperId, BookId, num, memo, status, validated, date
  }).then(transaction => {
    let newData = data.map(data => {
      data.TransId = transaction.id
      return data
    })
    db.TransactionRecord
      .bulkCreate(newData, {returning: true})
      .then(transactionRecord => res.json(transactionRecord))
      .catch(err => { res.status(400).json({ msg: 'Error', err })})
  })
})

// Fetch all transaction records
router.get("/transactions/branch/:branchId", auth, (req, res) => {
  const { branchId } = req.params
  db.sequelize.query("select tr.id, bo.name, tr.memo, tr.num, tr.validated, tr.date\n" +
      "from \"Books\" bo inner join \"Transactions\" tr on bo.id=tr.\"BookId\" inner join \"Bookkeepers\" b on tr.\"BookkeeperId\"=b.id\n" +
      "where b.\"BranchId\"=:branchId\n" +
      "order by tr.id desc, tr.\"date\" desc", {
    model: db.Transaction,
    replacements: { branchId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction records by bookId
router.get("/transactions/book/:branchId/:bookId", auth, (req, res) => {
  const { branchId, bookId } = req.params

  db.sequelize.query("select tr.id, tr.memo, tr.num, tr.date\n" +
  "from \"Transactions\" tr inner join \"Bookkeepers\" b on tr.\"BookkeeperId\"=b.id\n" +
  "where b.\"BranchId\"=:branchId and tr.\"BookId\"=:bookId\n" +
  "order by tr.id desc, tr.\"date\" desc", {
    model: db.Transaction,
    replacements: { branchId, bookId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction by TransId
router.get("/transactions/trans_id/:transId", auth, (req, res) => {
  const transId = req.params.transId

  db.sequelize.query("select t.date as date, t.num as num, t.memo as memo, t.status as status, t.\"createdAt\", t.\"updatedAt\", b.\"userName\" as userName \n" +
    "from \"Transactions\" t inner join \"Bookkeepers\" b on t.\"BookkeeperId\"=b.id \n" +
    "where t.id = :transId", {
    model: db.Transaction,
    replacements: { transId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction record by TransId
router.get("/transaction-records/trans_id/:transId", auth, (req, res) => {
  const transId = req.params.transId

  db.sequelize.query("select tr.id, tr.\"TransId\", tr.\"AccountId\" as account_id, a.name as name, tr.sub->'name' as sub, coalesce(tr.debit, 0) as debit, coalesce(tr.credit, 0) as credit\n" +
  "from \"TransactionRecords\" tr inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
  "where \"TransId\" = :transId\n" +
  "order by tr.id asc", {
    model: db.TransactionRecord,
    replacements: { transId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Delete transactions by TransId
router.delete("/transactions/:transId", auth, (req, res) => {
  const {transId} = req.params

  db.sequelize.query("delete from \"TransactionRecords\" where \"TransId\" = :transId", {
    model: db.TransactionRecord,
    replacements: { transId }
  }).then(() => {
    db.sequelize.query("delete from \"Transactions\" where id = :transId", {
      model: db.Transaction,
      replacements: { transId }
    }).then(() => res.json({ msg: 'Deleted!' }))
      .catch(err => res.status(400).json({ msg: 'ERROR DELETING', err }))
  })
    .catch(err => res.status(400).json({ msg: 'ERROR DELETING', err }))
})

// Fetch latest transaction by Bookkeeper
router.get("/transactions/latest/:id", auth, (req, res) => {
  const { id } = req.params

  db.sequelize.query("select tr.id\n" +
  "from \"Transactions\" tr inner join \"Bookkeepers\" b on tr.\"BookkeeperId\"=b.id\n" +
  "where b.\"id\"=:id\n" +
  "order by tr.id desc, tr.\"date\" desc\n" +
  "limit 1", {
    model: db.Transaction,
    replacements: { id }
  }).then(transaction => res.json(transaction))
    .catch(err => res.status(404).json({ msg: 'Error fetching data', err }))
})

// Update transactions with transactions table
router.put("/transactions/transaction/:id", auth, (req, res) => {
  const transId = req.params.id
  const status = 'updated'
  const { transaction, transRecord } = req.body
  const { BookkeeperId, date, num, memo, updatedAt } = transaction

  db.sequelize.query("update \"Transactions\"\n" +
    "set date=:date, \n" +
    "\"BookkeeperId\"=:BookkeeperId, \n" +
    "num=:num, \n" +
    "memo=:memo, \n" +
    "status=:status, \n" +
    "\"updatedAt\"=:updatedAt \n" +
    "where id=:transId", {
      model: db.Transaction,
      replacements: { BookkeeperId, transId, date, num, memo, status, updatedAt }
    }).then(() => {

      // For loop to iterate each transactionRecord
      let transPromise = []
      for(let i=0; i<transRecord.length; i++) {
        if (!transRecord[i].sub) {
          transPromise.push(db.TransactionRecord.update({
            AccountId: transRecord[i].account_id,
            debit: transRecord[i].debit,
            credit: transRecord[i].credit,
            sub: null
          }, {
            where: {
              id: transRecord[i].id
            }
          }))
        } else {
          transPromise.push(db.TransactionRecord.update({
            AccountId: transRecord[i].account_id,
            debit: transRecord[i].debit,
            credit: transRecord[i].credit,
            sub: {
              name: transRecord[i].sub
            }
          }, {
            where: {
              id: transRecord[i].id
            }
          }))
        }
      }
      console.log(transPromise)
      Promise.all(transPromise)
        .then(() => res.json({ msg: 'updated!' }))
        .catch(err => res.status(400).json({ msg: 'Error updating', err }))
    }).catch(err => console.log(err))
})
module.exports = router