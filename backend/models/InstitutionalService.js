/**
 * Institutional Service Model
 * Institutional/Departmental Services (NBA/NIRF etc.)
 */

const mongoose = require('mongoose');

const institutionalServiceSchema = new mongoose.Schema({
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
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['Coordinator', 'Others']
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
}, {
  timestamps: true
});

institutionalServiceSchema.index({ facultyId: 1, termId: 1 });

module.exports = mongoose.model('InstitutionalService', institutionalServiceSchema);
