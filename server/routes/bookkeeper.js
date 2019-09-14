const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/secret");
const { Bookkeeper } = require("../models");
const db = require("../models");
const auth = require('../middleware/auth')
const loginMiddleware = require('../middleware/loginMiddleware')

// Register Bookkeeper
router.post("/", (req, res) => {
  const { userName, password, BranchId } = req.body;

  Bookkeeper.findOne({ where: { userName: userName } })
    .then(user => {
      if (user) return res.status(400).json({ msg: "username already exists." });
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
            userName,
            password: newPassword,
            BranchId
          };
          try {
            const user = await Bookkeeper.create(newUser);
            jwt.sign(
              { userName: user.userName },
              jwtSecret,
              { expiresIn: 28800 },
              (err, token) => res.json({ token, user })
            );
          } catch (e) {
            res.status(400).json({
              msg: "username already in use."
            });
          }
        });
      })
    );
});

// Login Bookkeeper
router.post("/login", loginMiddleware, async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await Bookkeeper.findOne({ where: { userName } });

    bcrypt.compare(password, user.password, (err, response) => {
      if (err) throw err;

      if (response) {
        jwt.sign(
          { userName: user.userName },
          jwtSecret,
          { expiresIn: 28800 },
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

// Authorize Bookkeeper
router.get("/", auth, async (req, res) => {
  try {
      const user = await Bookkeeper.findOne({
        where: {
          userName: req.user.userName
        },
        include: [
          { model: db.Branch }
        ]
    });
    if(!user) return res.status(401).json({ msg: "Unauthorized." });
    res.json(user);
  } catch (e) {
    res.status(401).json({ msg: "Unauthorized." });
  }
});

module.exports = router;
