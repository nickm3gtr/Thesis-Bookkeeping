const express = require('express')
const router = express.Router()
const db = require('../models')
const Sequelize = require('Sequelize')
const Op = Sequelize.Op

// GET journal report
router.get('/journal/:start/:end', (req, res) => {
  // const { start, end } = req.query
  const start = req.params.start
  const end = req.params.end
  db.TransactionRecord.findAll({
    where: {
      date: {
        [Op.gte]: start,
        [Op.lte]: end
      }
    }
  }).then(journals => res.json(journals))
    .catch(err => res.status(400).json({ msg: 'Error fetching journals', err }))
})

module.exports = router