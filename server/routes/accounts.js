const express = require('express')
const router = express.Router()
const db = require('../models')
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
  db.Account.findAll({
    order: [
      ['id', 'ASC']
    ]
  })
    .then(accounts => res.json(accounts))
    .catch(err => res.status(400).json({ msg: 'Cant retrieve accounts', err }))
})

// Fetch all Account Types
router.get('/types', auth, (req, res) => {
  db.Type.findAll()
    .then(types => res.json(types))
    .catch(err => res.status(400).json({msg: 'Error fetching data', err}))
})

// Fetch all Account Types
router.get('/subtypes', auth, (req, res) => {
  db.SubType.findAll()
    .then(subtypes => res.json(subtypes))
    .catch(err => res.status(400).json({msg: 'Error fetching data', err}))
})

// Create an Account
router.post('/', auth, (req, res) => {
  const { id, name, SubTypeId } = req.body
  const status = 'active'
  db.Account.create({
    id,
    name,
    status,
    SubTypeId
  }).then(() => res.json({msg: 'Account added!'}))
    .catch(err => res.status(400).json({msg: 'Error adding account', err}))
})

module.exports = router