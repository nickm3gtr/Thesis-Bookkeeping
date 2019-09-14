const express = require('express')
const router = express.Router()
const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// GET journal report
router.get('/journal/:id/:start/:end', (req, res) => {
  // const { start, end } = req.query
  const start = req.params.start
  const end = req.params.end
  const id = req.params.id
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
    order: ['id']
  }).then(journals => res.json(journals))
    .catch(err => res.status(400).json({ msg: 'Error fetching journals', err }))
})

module.exports = router