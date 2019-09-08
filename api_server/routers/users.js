const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/**
 * Get user infos
 * @route GET /users/me
 * @security bearerAuth
 * @group users - Operations about users
 * @returns {object} 200 - An object of user infos
 * @returns {Error}  default - Unexpected error
 */

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.send(user);
});

/**
 * @typedef User
 * @property {string} name.required - name - eg: Jessie
 * @property {string} email.required - username or email - eg: user@domain
 * @property {string} password.required - user's password.
 */

/**
 * Register new user
 * @route POST /users
 * @group users - Operations about users
 * @param {User.model} body.body.required - name - eg: Jessie
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

});

module.exports = router; 
