
const express = require('express');
const users = require('../routers/users');
const auth = require('../routers/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/v1/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}