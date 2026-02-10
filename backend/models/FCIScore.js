/**
 * FCI Score Model
 * Faculty Course Interaction Score
 */

const mongoose = require('mongoose');

const fciScoreSchema = new mongoose.Schema({
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
  averageScore: {
    type: Number,
    required: [true, 'Average score is required'],
    min: 0,
    max: 10
  },
  numberOfCourses: {
    type: Number,
    required: [true, 'Number of courses is required'],
    min: 1
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

fciScoreSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('FCIScore', fciScoreSchema);
