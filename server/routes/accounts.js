const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
  db.Account.findAll()
    .then(accounts => res.json(accounts))
    .catch(err => res.status(400).json({ msg: 'Cant retrieve accounts', err }))
})

module.exports = router