/**
 * Other Contribution Model
 * Any Other Major Contributions
 */

const mongoose = require('mongoose');

const otherContributionSchema = new mongoose.Schema({
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
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
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

otherContributionSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('OtherContribution', otherContributionSchema);
