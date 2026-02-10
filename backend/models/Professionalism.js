/**
 * Professionalism Model
 * Professionalism / Team Spirit
 */

const mongoose = require('mongoose');

const professionalismSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term',
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

professionalismSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('Professionalism', professionalismSchema);
