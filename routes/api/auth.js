const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

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


// @route   GET api/auth/login
// @desc    Login User / Returns JWT
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({email})
    .then( user =>{
      if (!user){
        return res.status(404).json({email: "Email not found."});
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            const payload = { id: user.id, name: user.name, avatar: user.avatar }
            jwt.sign(
              payload,
              keys.secret,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: `Bearer ${token}`
                })
              });
          } else {
            res.status(400).json({password: "Password incorrect."});
          }
        })
    })
});

// @route   GET api/auth/current
// @desc    returns current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res)=>{
  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
