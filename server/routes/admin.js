const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/secret");
const { Admin } = require("../models");
const auth = require('../middleware/auth')
const loginMiddleware = require('../middleware/loginMiddleware')

// Login Admin
router.post("/login", loginMiddleware, async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await Admin.findOne({ where: { userName } });

    bcrypt.compare(password, user.password, (err, response) => {
      if (err) throw err;

      if (response) {
        jwt.sign(
          { userName: user.userName },
          jwtSecret,
          { expiresIn: 3600 },
          (err, token) => res.json({ token, user })
        );
      } else {
        res.status(400).json({ msg: "Incorrect password." });
      }
    });
  } catch (e) {
    res.status(400).json({ msg: "Invalid username." });
  }
})

// Authorize Admin
router.get("/", auth, async (req, res) => {
  try {
    const user = await Admin.findOne({ where: { userName: req.user.userName } });
    if(!user) return res.status(401).json({ msg: "Unauthorized." });
    res.json(user);
  } catch (e) {
    res.status(401).json({ msg: "Unauthorized." });
  }
});

module.exports = router