// models/TokenBlacklist.js
const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
