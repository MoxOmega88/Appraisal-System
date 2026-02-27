/**
 * Generic Controller Factory
 * Creates CRUD controllers for all appraisal modules
 */

// Generic factory for creating CRUD operations
const createController = (Model, modelName) => {
  return {
    // @desc    Get all records for a term
    // @route   GET /api/:resource?termId=xyz
    // @access  Private
    getAll: async (req, res) => {
      try {
        const { termId } = req.query;
        const query = { facultyId: req.user._id };
        
        if (termId) {
          query.termId = termId;
        }

        const records = await Model.find(query).sort({ createdAt: -1 });
        res.json(records);
      } catch (error) {
        console.error(`Get all ${modelName} error:`, error);
        res.status(500).json({ message: `Error fetching ${modelName}`, error: error.message });
      }
    },

    // @desc    Get single record by ID
    // @route   GET /api/:resource/:id
    // @access  Private
    getById: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ message: `${modelName} not found` });
        }

        // Verify ownership
        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to access this record' });
        }

        res.json(record);
      } catch (error) {
        console.error(`Get ${modelName} by ID error:`, error);
        res.status(500).json({ message: `Error fetching ${modelName}`, error: error.message });
      }
    },

    // @desc    Create new record
    // @route   POST /api/:resource
    // @access  Private
    create: async (req, res) => {
      try {
        const recordData = {
          ...req.body,
          facultyId: req.user._id
        };

        // ensure termId is propagated from query/body/params when available
        if (!recordData.termId) {
          if (req.body.termId) recordData.termId = req.body.termId;
          else if (req.query.termId) recordData.termId = req.query.termId;
          else if (req.params.termId) recordData.termId = req.params.termId;
        }

        // Add file path if file was uploaded
        if (req.file) {
          // Get the relative path from uploads folder
          const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
          recordData.filePath = `/uploads${relativePath}`;
        }

        // Add proof URL only for configured modules (backward compatibility)
        try {
          const proofConfig = require('../config/proofConfig');
          if (req.file && proofConfig.has(modelName)) {
            recordData.proofUrl = `/uploads/proofs/${req.file.filename}`;
          }
        } catch (e) {
          // If config missing, fall back to previous behavior (safe: do not add)
        }

        const record = await Model.create(recordData);
        res.status(201).json(record);
      } catch (error) {
        console.error(`Create ${modelName} error:`, error);
        if (error.name === 'ValidationError') {
          const msgs = Object.values(error.errors).map(e => e.message).join(', ');
          return res.status(400).json({
            message: `Validation failed: ${msgs}`,
            error: error.message
          });
        }
        res.status(400).json({ 
          message: `Error creating ${modelName}`, 
          error: error.message 
        });
      }
    },

    // @desc    Update record
    // @route   PUT /api/:resource/:id
    // @access  Private
    update: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ message: `${modelName} not found` });
        }

        // Verify ownership
        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to update this record' });
        }

        const updateData = { ...req.body };

        // ensure termId is preserved if sent via query/params
        if (!updateData.termId) {
          if (req.body.termId) updateData.termId = req.body.termId;
          else if (req.query.termId) updateData.termId = req.query.termId;
          else if (req.params.termId) updateData.termId = req.params.termId;
        }

        // Add file path if file was uploaded
        if (req.file) {
          // Get the relative path from uploads folder
          const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
          updateData.filePath = `/uploads${relativePath}`;
        }

        // Add proof URL only for configured modules (backward compatibility)
        try {
          const proofConfig = require('../config/proofConfig');
          if (req.file && proofConfig.has(modelName)) {
            updateData.proofUrl = `/uploads/proofs/${req.file.filename}`;
          }
        } catch (e) {
          // ignore
        }

        const updatedRecord = await Model.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        );

        res.json(updatedRecord);
      } catch (error) {
        console.error(`Update ${modelName} error:`, error);
        if (error.name === 'ValidationError') {
          const msgs = Object.values(error.errors).map(e => e.message).join(', ');
          return res.status(400).json({
            message: `Validation failed: ${msgs}`,
            error: error.message
          });
        }
        res.status(400).json({ message: `Error updating ${modelName}`, error: error.message });
      }
    },

    // @desc    Delete record
    // @route   DELETE /api/:resource/:id
    // @access  Private
    deleteRecord: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ message: `${modelName} not found` });
        }

        // Verify ownership
        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to delete this record' });
        }

        await Model.findByIdAndDelete(req.params.id);
        res.json({ message: `${modelName} deleted successfully` });
      } catch (error) {
        console.error(`Delete ${modelName} error:`, error);
        res.status(500).json({ message: `Error deleting ${modelName}`, error: error.message });
      }
    }
  };
};

module.exports = createController;