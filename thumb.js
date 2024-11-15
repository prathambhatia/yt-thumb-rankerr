const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThumbSchema = Schema({
  url: String,
  rating: Number,
  title: String,
  img: String
});

module.exports = mongoose.model('Thumb', ThumbSchema);

