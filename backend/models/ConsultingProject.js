/**
 * Consulting Project Model
 * Consulting Projects
 */

const mongoose = require('mongoose');

const consultingProjectSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  clientName: {
    type: String,
    trim: true
  },
  completionDate: {
    type: Date
  },
  
}, {
  timestamps: true
});

consultingProjectSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('ConsultingProject', consultingProjectSchema);
