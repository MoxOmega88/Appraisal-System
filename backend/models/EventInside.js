/**
 * Event Inside Model
 * Events Participated Inside Institute
 */

const mongoose = require('mongoose');

const eventInsideSchema = new mongoose.Schema({
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
    enum: ['FDP', 'Seminar', 'Workshop', 'Conference', 'Meeting']
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
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

eventInsideSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('EventInside', eventInsideSchema);
