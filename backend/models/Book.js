/**
 * Book Model
 * Books / Book Chapters
 */

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
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
    enum: ['Book', 'Chapter']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  authorPosition: {
    type: Number,
    required: [true, 'Author position is required'],
    min: 1,
    max: 3
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required']
  },
  isbn: {
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

bookSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('Book', bookSchema);
