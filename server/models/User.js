const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  rippleScore: Number,
});

module.exports = mongoose.model('User', UserSchema);
