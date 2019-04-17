const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// @route   GET api/auth/test
// @desc    Tests auth route
// @access  Public
router.get('/test', (req, res) => {res.json({msg: "Auth works."});});

// @route   GET api/auth/register
// @desc    registers a user
// @access  Public
router.post('/register', (req, res) => {

  User.findOne({email: req.body.email})
    .then(user => {
      if(user){
        return res.status(400).json({email: 'Email already exists'});
      } else {

        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        console.log("body: ", req.body)

        const password = bcrypt.hashSync(req.body.password, 8)

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: password
        });

        newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      }
    });
});

module.exports = router;
