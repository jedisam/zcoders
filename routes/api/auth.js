const express = require ('express');
const router = express.Router ();
const { check, validationResult } = require('express-validator');
const auth = require ('../../middleware/auth');
const User = require ('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv/config')

// @route GET /api/auth
// @desc test route
// @access private
router.get ('/', auth, async (req, res) => {
  try {
    const user = await User.findById (req.user.id).select ('-password');
    res.json (user);
  } catch (err) {
    console.error (err);
    res.status (500).send ('Server Error');
  }
});


// @route POST /api/auth/
// @desc Authenticate user & get token
// @access public
router.post (
  '/',
  [
    check ('email', 'Email is not Valid!').isEmail (),
    check (
      'password',
      'Password is required'
    ).exists (),
  ],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    const { email, password} = req.body;

    try {
      let user = await User.findOne ({email});
      if (!user) {
        return res.status (400).json ({errors: [{msg: 'Invalid Credentials'}]});
      }

      const isMatch = await bcrypt.compare(password, user.password)
      
      if(!isMatch) {
        return res.status (400).json ({errors: [{msg: 'Invalid Credentials'}]});
      }

      //Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign (
        payload,
        process.env.jwtSecret,
        {expiresIn: 3600000},
        (err, token) => {
          if (err) throw err;
          res.json ({token});
        }
      );
    } catch (err) {
      console.error (err.message);
      res.status (500).send ('Server Error!');
    }
  }
);

module.exports = router;
