const express = require('express')
const router = express.Router()
const db = require('../models')

// Fetch all transaction records from admin
router.get("/admin-transactions", (req, res) => {
  db.sequelize.query("select tr.id, br.\"branchName\", tr.memo, tr.num, tr.date\n" +
      "from \"Transactions\" tr inner join \"Bookkeepers\" b on tr.\"BookkeeperId\"=b.id inner join \"Branches\" br on b.\"BranchId\"=br.id \n" +
      "order by tr.\"date\" desc, tr.id desc", {
    model: db.Transaction
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})

// Fetch transaction records by bookId
router.get("/admin-transactions/book/:bookId", (req, res) => {
  const { bookId } = req.params

  db.sequelize.query("select tr.id, tr.memo, tr.num, tr.date\n" +
  "from \"Transactions\" tr inner join \"Bookkeepers\" b on tr.\"BookkeeperId\"=b.id\n" +
  "where tr.\"BookId\"=:bookId\n" +
  "order by tr.\"date\" desc, tr.id desc", {
    model: db.Transaction,
    replacements: { bookId }
  }).then(transactions => res.json(transactions))
    .catch(err => res.status(400).json({ msg: "Can't fetch transactions", err }))
})


module.exports = router