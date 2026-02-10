/**
 * UG Guidance Model
 * Research Guidance - Undergraduate
 */

const mongoose = require('mongoose');

const ugGuidanceSchema = new mongoose.Schema({
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
  numberOfStudents: {
    type: Number,
    required: [true, 'Number of students is required'],
    min: 0
  },
  projectTitle: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

ugGuidanceSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('UGGuidance', ugGuidanceSchema);
