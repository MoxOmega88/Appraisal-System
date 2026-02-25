/**
 * Journal Paper Model
 * Refereed Journal Papers (SJR/Scopus/WoS)
 */

const mongoose = require('mongoose');

const journalPaperSchema = new mongoose.Schema({
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
  journalName: {
    type: String,
    required: [true, 'Journal name is required'],
    trim: true
  },
  indexedIn: {
    type: String,
    required: [true, 'Indexing information is required'],
    enum: ['SJR', 'Scopus', 'WoS', 'SJR & Scopus', 'SJR & WoS', 'Scopus & WoS', 'All']
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
  },
  doi: {
    type: String,
    trim: true
  },
  proofUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

journalPaperSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('JournalPaper', journalPaperSchema);
