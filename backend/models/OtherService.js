/**
 * Other Service Model
 * Other Services to Institution or Society
 */

const mongoose = require('mongoose');

const otherServiceSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  date: {
    type: Date
  },
  proofUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

otherServiceSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('OtherService', otherServiceSchema);
