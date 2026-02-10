/**
 * Funded Project Model
 * Funded Projects
 */

const mongoose = require('mongoose');

const fundedProjectSchema = new mongoose.Schema({
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
  fundingAmount: {
    type: Number,
    required: [true, 'Funding amount is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['≥10 Lakhs', '5-10 Lakhs', '1-5 Lakhs', '<1 Lakh']
  },
  fundingAgency: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

fundedProjectSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('FundedProject', fundedProjectSchema);
