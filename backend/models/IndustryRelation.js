/**
 * Industry Relation Model
 * Industry Relations (MoU / Co-hosted Event / Technical Talk Series)
 */

const mongoose = require('mongoose');

const industryRelationSchema = new mongoose.Schema({
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
    enum: ['MoU', 'Co-hosted Event', 'Technical Talk Series']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  proofUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

industryRelationSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('IndustryRelation', industryRelationSchema);
