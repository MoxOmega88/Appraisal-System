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
    required: true
  },
  activityName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  documents: [{
    fileName: String,
    filePath: String,
    originalName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]

}, {
  timestamps: true
});

professionalismSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('Professionalism', professionalismSchema);
