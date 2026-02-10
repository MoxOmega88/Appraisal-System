/**
 * Disclosure Model
 * Disclosures Filed
 */

const mongoose = require('mongoose');

const disclosureSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  filingDate: {
    type: Date,
    required: [true, 'Filing date is required']
  },
  applicationNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

disclosureSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('Disclosure', disclosureSchema);
