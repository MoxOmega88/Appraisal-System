/**
 * Event Outside Model
 * Events Participated Outside Institute
 */

const mongoose = require('mongoose');

const eventOutsideSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['FDP', 'Seminar', 'Workshop', 'Conference']
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  organization: {
    type: String,
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

eventOutsideSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('EventOutside', eventOutsideSchema);
