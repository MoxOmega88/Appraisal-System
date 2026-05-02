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
  venueName: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['Journal', 'Conference'],
    default: null
  },
  quartile: {
    type: String,
    default: null
  },
  conferenceDetails: {
    type: String,
    default: null
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    default: null
  },
  year: {
    type: Number
  },
  isQ1Q2Reviewer: {
    type: Boolean,
    default: false
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
