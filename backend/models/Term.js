/**
 * Term Model
 * Represents an appraisal term/period for a faculty member
 */

const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Faculty ID is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  durationMonths: {
    type: Number,
    required: [true, 'Duration in months is required'],
    min: 1
  },
  termName: {
    type: String,
    required: [true, 'Term name is required'],
    trim: true
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
termSchema.index({ facultyId: 1, startDate: -1 });

module.exports = mongoose.model('Term', termSchema);