/**
 * Patent Model
 * Patents Granted
 */

const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
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
  grantDate: {
    type: Date,
    required: [true, 'Grant date is required']
  },
  patentNumber: {
    type: String,
    required: [true, 'Patent number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Filed', 'Published', 'Granted'],
    required: [true, 'Status is required'],
    default: 'Granted'
  },
  proofUrl: {
    type: String,
    default: null
  },
  filePath: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

patentSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('Patent', patentSchema);
