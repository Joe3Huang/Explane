const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/**
 * @typedef AuthInput
 * @property {string} email.required - username or email - eg: user@domain
 * @property {string} password.required - user's password - eg: 12345
 */

/**
 * Login User
 * @route POST /auth
 * @group auth - Operations about auth
 * @param {AuthInput.model} body.body.required - name - eg: Jessie
 * @returns {object} 200 - A token object
 * @returns {Error}  default - Unexpected error
 */

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
