'use strict';

const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
  noun: { type: String, required: true },
  verb: { type: String, required: true }
});