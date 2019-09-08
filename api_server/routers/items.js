const auth = require('../middleware/auth');
// const jwt = require('jsonwebtoken');
// const config = require('config');
const _ = require('lodash');
const {Item, validate} = require('../models/item');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
var multer  = require('multer');
const HOST_URL = process.env.HEROKU_URL || 'localhost:3000';
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }    
})

var upload = multer({
  limits: { fileSize: 102400 },
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  }
});

/**
 * Get items
 * @route GET /items
 * @group items - Operations about items
 * @returns {object} 200 - array of items
 * @returns {Error}  default - Unexpected error
 */

router.get('/', async (req, res) => {
    const items = await Item.find({});
    res.send(items);
});

/**
 * Get item
 * @route GET /items/:id
 * @security bearerAuth
 * @group items - Operations about items
 * @returns {object} 200 - An object of item
 * @returns {Error}  default - Unexpected error
 */

router.get('/:id', auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password');
//   res.send(user);
    res.send("hello");
});

/**
 * @typedef Items
 * @property {string} name.required - name - eg: toy
 * @property {string} description.required - about the item - eg: This an awesome toy.
 * @property {file} images.required - image ids.
 */

/**
 * Create new item
 * @route POST /items
 * @group items - Operations about items
 * @param {Items.model} body.body.required
 * @returns {object} 200 - An object of item info
 * @returns {Error}  default - Unexpected error
 */

router.post('/', upload.array('images', 1), async (req, res) => {
  //console.log(req.files);
  try {
    req.body.image = `https://${HOST_URL}/public/${req.files[0].filename}`;
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) throw { message: error.details[0].message }
    let item = new Item(_.pick(req.body, ['name', 'description', 'image']));
    await item.save();
    res.send(item);
  } catch (err) {
    req.files.map(f => fs.unlinkSync(path.resolve(f.path)));
    res.status(500).send(err.message);
  }

  // 
  // let user = await User.findOne({ email: req.body.email });
  // if (user) return res.status(400).send('User already registered.');
  // user = new User(_.pick(req.body, ['name', 'email', 'password']));
  // const salt = bcrypt.genSaltSync(10);
  // user.password = bcrypt.hashSync(user.password, salt);
  // await user.save();
  // const token = user.generateAuthToken();
  // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router; 
