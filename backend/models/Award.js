/**
 * Award Model
 * Awards and Honours
 */

const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
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
  issuingBody: {
    type: String,
    required: [true, 'Issuing body is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  proofUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

awardSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('Award', awardSchema);
