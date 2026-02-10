/**
 * FDP Organized Model
 * FDP/Seminar/Workshop Organized as Coordinator
 */

const mongoose = require('mongoose');

const fdpOrganizedSchema = new mongoose.Schema({
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
  eventTitle: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  durationCategory: {
    type: String,
    required: [true, 'Duration category is required'],
    enum: ['5 Days', '3 Days', 'Other']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

fdpOrganizedSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('FDPOrganized', fdpOrganizedSchema);
