const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/secret");
const { Bookkeeper } = require("../models");
const db = require("../models");
const auth = require('../middleware/auth')
const loginMiddleware = require('../middleware/loginMiddleware')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// Register Bookkeeper
router.post("/", auth, (req, res) => {
  const {
    userName,
    password,
    firstName,
    lastName,
    account,
    BranchId
  } = req.body;
  const status = 'created'

  Bookkeeper.findOne({ where: { userName: userName } })
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
          Bookkeeper.create(newUser)
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
    const user = await Bookkeeper.findOne({
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

// Find All Bookkeepers
router.get("/all-bookkeepers", auth, (req, res) => {
  db.sequelize.query("select b.id as id, b.\"userName\" as name, br.id as branchId, br.\"branchName\" as branch\n" +
    "from \"Bookkeepers\" b inner join \"Branches\" br on b.\"BranchId\"=br.id\n" +
    "where b.status in ('active', 'inactive', 'created') \n" +
    "order by b.id", {
    model: db.Bookkeeper
  }).then(bookkeepers => res.json(bookkeepers))
    .catch(err => res.status(400).json({ msg: "Can't get bookkeepers", err }))
})

// Delete a bookkeeper
router.delete("/:id", auth, (req, res) => {
  const id = req.params.id
  db.Bookkeeper.destroy({
    where: {
      id: id
    }
  }).then(res.json({ msg: `Deleted` }))
    .catch(err => res.status(400).json({ msg: 'not deleted', err }))
})

//Delete bookkeeper through delete
router.put("/:id", (req, res) => {
  const { id } = req.params
  db.sequelize.query("update \"Bookkeepers\" \n" +
  "set status='deleted' \n" +
  "where id=:id", {
    model: db.Bookkeeper,
    replacements: { id }
  }).then(() => res.json({ msg: 'Deleted' }))
    .catch(err => res.status(400).json({ msg: 'not deleted', err }))
})


// Get bookkeeper details -- BOOKKEEPER PROFILE
router.get("/profile/:id", auth, (req, res) => {
  const { id } = req.params
  db.sequelize.query("select b.id, b.\"userName\", b.\"firstName\", b.\"lastName\", br.\"branchName\" \n" +
  "from \"Bookkeepers\" b inner join \"Branches\" br on b.\"BranchId\"=br.id \n" +
  "where b.id=:id \n" +
  "limit 1", {
    model: db.Bookkeeper,
    replacements: { id }
  }).then(bookkeeper => res.json(bookkeeper))
    .catch(err => res.status(400).json({ msg: 'Error', err }))
})

// Bookkeeper Update PASSWORD
router.post("/change-password/:id", auth, (req, res) => {
  const { id } = req.params
  // eslint-disable-next-line no-unused-vars
  const { currentPassword, newPassword, retypePassword } = req.body
  // Get account details of bookkeeper
  db.Bookkeeper.findOne({
    where: {
      id: id
    }
  }).then(bookkeeper => {
    // Compare if current password is correct
    bcrypt.compare(currentPassword, bookkeeper.password, (err, response) => {
      // eslint-disable-next-line no-console
      if (err) console.log('wrong current password') 
      if (response) {
        if (newPassword !== retypePassword) {
          res.status(400).json({msg: 'new password and confirm password is not the same', err})
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw res.status(400).json({msg: 'Error', err})
            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) throw res.status(400).json({msg: 'Error', err})
              const hashPassword = hash
              db.sequelize.query("update \"Bookkeepers\" \n" +
              "set \"password\"=:hashPassword, \n" +
              "\"status\"='active' \n" +
              "where id=:id", {
                model: db.Bookkeeper,
                replacements: {id, hashPassword}
              }).then(() => res.json({msg: 'Changed password!'}))
                .catch(err => res.status(400).json({msg: 'Err', err}))
            })
          })
        }
      } else {
        res.status(400).json({msg: 'Wrong current password'})
      }
    })
  }).catch(err => res.status(400).json({msg: 'Error', err}))
})

module.exports = router;
