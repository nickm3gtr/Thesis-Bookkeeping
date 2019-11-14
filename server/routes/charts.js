const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require("../middleware/auth")

// Get Chart of Accounts
router.get('/', auth, (req, res) => {
  db.Account.findAll({
    include: [{
      model: db.SubType,
      include: [{
        model: db.Type
      }]
    }],
    where: {
      status: 'active'
    },
    order: [
      ['SubTypeId', 'ASC']
    ]
  })
    .then(accounts => res.json(accounts))
    // eslint-disable-next-line no-unused-vars
    .catch(err => res.status(400).json({ msg: 'Bad request', err }))
})

router.get('/all', auth, (req, res) => {
  db.Account.findAll({
    include: [{
      model: db.SubType,
      include: [{
        model: db.Type
      }]
    }],
    order: [
      ['SubTypeId', 'ASC']
    ]
  })
    .then(accounts => res.json(accounts))
    // eslint-disable-next-line no-unused-vars
    .catch(err => res.status(400).json({ msg: 'Bad request', err }))
})
module.exports = router