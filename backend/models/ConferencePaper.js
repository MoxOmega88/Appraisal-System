/**
 * Conference Paper Model
 * Indexed Conference Papers (SJR/Scopus/WoS)
 */

const mongoose = require('mongoose');

const conferencePaperSchema = new mongoose.Schema({
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
  conferenceName: {
    type: String,
    required: [true, 'Conference name is required'],
    trim: true
  },
  authorPosition: {
    type: Number,
    required: [true, 'Author position is required'],
    min: 1,
    max: 3
  },
  publicationDate: {
    type: Date,
    required: [true, 'Publication date is required']
  }
}, {
  timestamps: true
});

conferencePaperSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('ConferencePaper', conferencePaperSchema);
