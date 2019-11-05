const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require('../middleware/auth')

// Get all books
router.get("/", auth, (req, res) => {
  db.Book.findAll()
    .then(books => res.json(books))
    .catch(err => res.status(400).json({ msg: 'Error cant get books', err }))
})


module.exports = router