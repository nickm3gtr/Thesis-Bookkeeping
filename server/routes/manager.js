const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/secret");
const db = require("../models");
const auth = require('../middleware/auth')
const loginMiddleware = require('../middleware/loginMiddleware')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// Register Manager
router.post("/", (req, res) => {
  const {
    userName,
    password,
    firstName,
    lastName,
    account,
    BranchId
  } = req.body;
  const status = 'created'

  db.Manager.findOne({ where: { userName: userName } })
    .then(user => {
      if (user) return res.status(400).json({ msg: "username already exists." });
    })
    .catch(
      bcrypt.genSalt(10, (err, salt) => {
        // eslint-disable-next-line no-console
        if (err) console.log(err);
        bcrypt.hash(password, salt, (err, hash) => {
          // eslint-disable-next-line no-console
          if (err) console.log(err);
          const newPassword = hash;
          const newUser = {
            userName,
            password: newPassword,
            firstName,
            lastName,
            account: account,
            status,
            BranchId
          };
          db.Manager.create(newUser)
            .then(account => res.json(account))
            .catch(err => res.status(400).json({ msg: "Account not created.", err }))
        });
      })
    );
});

// Login Bookkeeper
router.post("/login", loginMiddleware, async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await db.Manager.findOne({
      where: {
        userName,
        [Op.or]: [{ status: 'active' }, { status: 'created' }]
      },
      include: [
        { model: db.Branch }
      ]
    });

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

// Authorize Manager
router.get("/", auth, async (req, res) => {
  try {
      const user = await db.Manager.findOne({
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

// Find All Managers
router.get("/all-managers", auth, (req, res) => {
  db.sequelize.query("select b.id as id, b.\"userName\" as name, br.id as branchId, br.\"branchName\" as branch\n" +
    "from \"Managers\" b inner join \"Branches\" br on b.\"BranchId\"=br.id\n" +
    "where b.status in ('active', 'inactive', 'created') \n" +
    "order by b.id", {
    model: db.Manager
  }).then(bookkeepers => res.json(bookkeepers))
    .catch(err => res.status(400).json({ msg: "Can't get managers", err }))
})

//Delete manager through delete
router.put("/:id", (req, res) => {
  const { id } = req.params
  db.sequelize.query("update \"Managers\" \n" +
  "set status='deleted' \n" +
  "where id=:id", {
    model: db.Manager,
    replacements: { id }
  }).then(() => res.json({ msg: 'Deleted' }))
    .catch(err => res.status(400).json({ msg: 'not deleted', err }))
})





module.exports = router