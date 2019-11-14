const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

// Fetch all transaction records from admin
router.get("/admin-transactions", auth, (req, res) => {
  db.sequelize.query("select tr.id, br.\"branchName\", tr.memo, tr.num, tr.date\n" +
      "from \"Transactions\" tr inner join \"Bookkeepers\" b on tr.\"BookkeeperId\"=b.id inner join \"Branches\" br on b.\"BranchId\"=br.id \n" +
      "order by tr.id desc, tr.\"date\" desc", {
    model: db.Transaction
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction records by bookId
router.get("/admin-transactions/book/:bookId", auth, (req, res) => {
  const { bookId } = req.params

  db.sequelize.query("select tr.id, br.\"branchName\", tr.memo, tr.num, tr.date\n" +
  "from \"Transactions\" tr inner join \"Bookkeepers\" b on tr.\"BookkeeperId\"=b.id inner join \"Branches\" br on b.\"BranchId\"=br.id\n" +
  "where tr.\"BookId\"=:bookId\n" +
  "order by tr.id desc, tr.\"date\" desc ", {
    model: db.Transaction,
    replacements: { bookId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch years that occurs in a transaction "ADMIN"
router.get("/admin-years", auth, (req, res) => {
  db.sequelize.query("select extract(year from t.\"date\") \n" +
  "from \"Transactions\" t \n" +
  "group by date_part", {
    model: db.Transaction
  }).then(years => res.json(years))
    .catch(err => res.status(400).json({msg: 'Error', err}))
})

//Update transaction status VALIDATE
// Update account status to active
router.put('/validated', auth, (req, res) => {
  const { items } = req.body
  db.Transaction.update(
    {
      validated: 'validated'
    },
    {
      where: {
        id: [...items]
      }
    }
  ).then(() => res.json({ msg: "Validated" }))
  .catch(() => res.status(400).json({ msg: "Can't validate" }))
})

module.exports = router