/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

router.post("/general-journal", (req, res) => {
  let { BranchId, BookId, num, memo, date, data } = req.body
  db.Transaction.create({
    BranchId, BookId, num, memo, date
  }).then(transaction => {
    let newData = data.map(data => {
      data.TransId = transaction.id
      return data
    })
    // eslint-disable-next-line no-console
    console.log(newData)
    db.TransactionRecord
      .bulkCreate(newData, {returning: true})
      .then(transactionRecord => res.json(transactionRecord))
      .catch(err => { res.status(400).json({ msg: 'Error', err })})
  })
})

// Fetch all transaction records
router.get("/transactions/branch/:branchId", auth, (req, res) => {
  const { branchId } = req.params
  db.sequelize.query("select id, memo, num, date\n" +
      "from \"Transactions\"\n" +
      "where \"BranchId\"=:branchId\n" +
      "order by id desc, \"date\" desc", {
    model: db.Transaction,
    replacements: { branchId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction records by bookId
router.get("/transactions/book/:branchId/:bookId", auth, (req, res) => {
  const { branchId, bookId } = req.params

  db.sequelize.query("select id, memo, num, date\n" +
  "from \"Transactions\"\n" +
  "where \"BranchId\"=:branchId and \"BookId\"=:bookId\n" +
  "order by id desc, \"date\" desc", {
    model: db.Transaction,
    replacements: { branchId, bookId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction by TransId
router.get("/transactions/trans_id/:transId", (req, res) => {
  const transId = req.params.transId

  db.sequelize.query("select *\n" +
    "from \"Transactions\"\n" +
    "where id = :transId", {
    model: db.TransactionRecord,
    replacements: { transId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction record by TransId
router.get("/transaction-records/trans_id/:transId", (req, res) => {
  const transId = req.params.transId

  db.sequelize.query("select tr.id, tr.\"TransId\", tr.\"AccountId\" as account_id, a.name as name, coalesce(tr.debit, 0) as debit, coalesce(tr.credit, 0) as credit\n" +
  "from \"TransactionRecords\" tr inner join \"Accounts\" a on tr.\"AccountId\"=a.id\n" +
  "where \"TransId\" = :transId\n" +
  "order by tr.id asc", {
    model: db.TransactionRecord,
    replacements: { transId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Delete transactions by TransId
router.delete("/transactions/:transId", (req, res) => {
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
router.get("/transactions/latest/:id", (req, res) => {
  const { id } = req.params

  db.Transaction.findOne({
    where: {
      BranchId: id
    },
    order: [['id', 'DESC']]
  }).then(transaction => res.json(transaction))
    .catch(err => res.status(404).json({ msg: 'Error fetching data', err }))
})

// // Update Transactions by ID
// router.put("/transactions/update/:id", (req, res) => {
//   const id = parseInt(req.params.id)
//   const AccountId = parseInt(req.body.AccountId)
//   const {  debit, credit } = req.body

//   db.sequelize.query("update \"TransactionRecords\"\n" +
// 	"set debit = :debit,\n" +
// 	" credit = :credit,\n" +
// 	" \"AccountId\" = :AccountId\n" +
// 	"where id=:id", {
//     model: db.TransactionRecord,
//     replacements: { id, AccountId, debit, credit }
//   }).then(update => res.json({ msg: 'Updated!', update }))
//     .catch(err => res.status(404).json({ msg: 'Error updating data', err }))
// })

// Update transactions with transactions table
router.put("/transactions/transaction/:id", (req, res) => {
  const transId = req.params.id
  const { transaction, transRecord } = req.body
  const { date, num, memo, updatedAt } = transaction

  db.sequelize.query("update \"Transactions\"\n" +
    "set date=:date, \n" +
    "num=:num, \n" +
    "memo=:memo, \n" +
    "\"updatedAt\"=:updatedAt \n" +
    "where id=:transId", {
      model: db.Transaction,
      replacements: { transId, date, num, memo, updatedAt }
    }).then(() => {

      // For loop to iterate each transactionRecord
      let transPromise = []
      for(let i=0; i<transRecord.length; i++) {
        transPromise.push(db.TransactionRecord.update({
          AccountId: transRecord[i].account_id,
          debit: transRecord[i].debit,
          credit: transRecord[i].credit
        }, {
          where: {
            id: transRecord[i].id
          }
        }))
      }
      Promise.all(transPromise)
        .then(() => res.json({ msg: 'updated!' }))
        .catch(err => res.status(400).json({ msg: 'Error updating', err }))
    }).catch(err => console.log(err))
})
module.exports = router