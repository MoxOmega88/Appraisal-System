/**
 * Non-Indexed Publication Model
 * Non-refereed Journals & Non-indexed Conferences
 */

const mongoose = require('mongoose');

const nonIndexedPublicationSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Journal', 'Conference']
  },
  authorPosition: {
    type: Number,
    required: [true, 'Author position is required'],
    min: 1
  },
  publicationDate: {
    type: Date,
    required: [true, 'Publication date is required']
  },
  
}, {
  timestamps: true
});

nonIndexedPublicationSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('NonIndexedPublication', nonIndexedPublicationSchema);
