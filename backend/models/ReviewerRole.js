/**
 * Reviewer Role Model
 * Conference Chair / Session Chair / Reviewer
 */

const mongoose = require('mongoose');

const reviewerRoleSchema = new mongoose.Schema({
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
  roleType: {
    type: String,
    required: [true, 'Role type is required'],
    enum: ['Conference Chair', 'Session Chair', 'Reviewer']
  },
  isQ1Q2Reviewer: {
    type: Boolean,
    default: false
  },
  venueName: {
    type: String,
    trim: true
  },
  year: {
    type: Number
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

reviewerRoleSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('ReviewerRole', reviewerRoleSchema);
