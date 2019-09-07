const express = require("express");
const router = express.Router();
const { Account, Type } = require("../models");
const auth = require("../middleware/auth")

// Get Chart of Accounts
router.get('/', auth, (req, res) => {
  Account.findAll({
    include: [{
      model: Type
    }]
  })
    .then(accounts => res.json(accounts))
    // eslint-disable-next-line no-unused-vars
    .catch(err => res.status(400).json({ msg: 'Bad request' }))
})

module.exports = router