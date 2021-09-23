const mongoose = require('mongoose');
const feedSchema = new mongoose.Schema({}, {strict: false}); // Allow for dynamic fields
const feed = mongoose.model('feed', feedSchema);

module.exports = (
  feed
);
