/**
 * PhD Guidance Model
 * Research Guidance - PhD
 */

const mongoose = require('mongoose');

const phdGuidanceSchema = new mongoose.Schema({
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
  numberOfScholars: {
    type: Number,
    required: [true, 'Number of scholars is required'],
    min: 0
  },
  scholarName: {
    type: String,
    trim: true
  },
  researchArea: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Submitted'],
    default: 'Ongoing'
  }
}, {
  timestamps: true
});

phdGuidanceSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('PhDGuidance', phdGuidanceSchema);
