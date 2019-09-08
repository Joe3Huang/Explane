const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2048
  },
  image: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  }
});

const Item = mongoose.model('Item', itemSchema);

function validateItem(item) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(2048).required(),
    image: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(item, schema);
}

exports.Item = Item; 
exports.validate = validateItem;