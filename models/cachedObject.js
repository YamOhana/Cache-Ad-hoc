const mongoose = require('mongoose');

const cachedObjectSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
  },
  URL: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  lastUpdateDate: {
    type: Date,
    required: true,
  },
  cachedData: {
    type: String, 
    required: true,
  },
  requestType: {
    type: String,
    enum: ['ad-hoc', 'batch'],
    required: true,
  },
});

module.exports = mongoose.model('CachedObject', cachedObjectSchema);
