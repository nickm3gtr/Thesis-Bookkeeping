const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/secret");
const { Bookkeeper } = require("../models");
const auth = require('../middleware/auth')
const loginMiddleware = require('../middleware/loginMiddleware')

// Register Bookkeeper
router.post("/", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  Bookkeeper.findOne({ where: { email: email } })
    .then(user => {
      if (user) return res.status(400).json({ msg: "Email already exists." });
    })
    .catch(
      bcrypt.genSalt(10, (err, salt) => {
        // eslint-disable-next-line no-console
        if (err) console.log(err);
        bcrypt.hash(password, salt, async (err, hash) => {
          // eslint-disable-next-line no-console
          if (err) console.log(err);
          const newPassword = hash;
          const newUser = {
            firstName,
            lastName,
            email,
            password: newPassword
          };
          try {
            const user = await Bookkeeper.create(newUser);
            jwt.sign(
              { email: user.email },
              jwtSecret,
              { expiresIn: 3600 },
              (err, token) => res.json({ token, user })
            );
          } catch (e) {
            res.status(400).json({
              msg: "Email already in use."
            });
          }
        });
      })
    );
});

// Login Bookkeeper
router.post("/login", loginMiddleware, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Bookkeeper.findOne({ where: { email: email } });

    bcrypt.compare(password, user.password, (err, response) => {
      if (err) throw err;

      if (response) {
        jwt.sign(
          { email: user.email },
          jwtSecret,
          { expiresIn: 3600 },
          (err, token) => res.json({ token, user })
        );
      } else {
        res.status(400).json({ msg: "Incorrect password." });
      }
    });
  } catch (e) {
    res.status(400).json({ msg: "Invalid email." });
  }
})

// Authorize Bookkeeper
router.get("/", auth, async (req, res) => {
  try {
    const user = await Bookkeeper.findOne({ where: { email: req.user.email } });
    if(!user) return res.status(401).json({ msg: "Unauthorized." });
    res.json(user);
  } catch (e) {
    res.status(401).json({ msg: "Unauthorized." });
  }
});

module.exports = router;
