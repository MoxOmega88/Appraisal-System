/**
 * Invited Talk Model
 * Invited Technical Talks Outside Institute
 */

const mongoose = require('mongoose');

const invitedTalkSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
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

invitedTalkSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('InvitedTalk', invitedTalkSchema);
