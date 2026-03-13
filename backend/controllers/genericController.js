const createController = (Model, modelName) => {
  return {
    getAll: async (req, res) => {
      try {
        const { termId } = req.query;
        const query = { facultyId: req.user._id };
        
        if (termId) {
          query.termId = termId;
        }

        const records = await Model.find(query).sort({ createdAt: -1 });
        res.json({
          success: true,
          message: `${modelName} fetched successfully`,
          data: records
        });
      } catch (error) {
        console.error(`Get all ${modelName} error:`, error);
        res.status(500).json({ 
          success: false,
          message: `Error fetching ${modelName}`, 
          error: error.message 
        });
      }
    },

    getById: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ 
            success: false,
            message: `${modelName} not found` 
          });
        }

        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ 
            success: false,
            message: 'Not authorized to access this record' 
          });
        }

        res.json({
          success: true,
          message: `${modelName} fetched successfully`,
          data: record
        });
      } catch (error) {
        console.error(`Get ${modelName} by ID error:`, error);
        res.status(500).json({ 
          success: false,
          message: `Error fetching ${modelName}`, 
          error: error.message 
        });
      }
    },

    create: async (req, res) => {
      try {
        const modelKey = Model.modelName;

        // Validation for specific models
        if (modelKey === 'UGGuidance' || modelKey === 'MastersGuidance') {
          const numberOfStudents = req.body.numberOfStudents;
          if (numberOfStudents === undefined || numberOfStudents === null || numberOfStudents === '' || isNaN(Number(numberOfStudents)) || Number(numberOfStudents) < 0) {
            return res.status(400).json({
              success: false,
              message: 'Number of students is required and must be greater than or equal to 0'
            });
          }
        }

        if (modelKey === 'PhDGuidance') {
          const numberOfScholars = req.body.numberOfScholars;
          if (numberOfScholars === undefined || numberOfScholars === null || numberOfScholars === '' || isNaN(Number(numberOfScholars)) || Number(numberOfScholars) < 0) {
            return res.status(400).json({
              success: false,
              message: 'Number of scholars is required and must be greater than or equal to 0'
            });
          }
          if (!req.body.status || !['Ongoing', 'Completed', 'Submitted'].includes(req.body.status)) {
            return res.status(400).json({
              success: false,
              message: 'Status is required and must be one of: Ongoing, Completed, Submitted'
            });
          }
        }

        if (modelKey === 'ReviewerRole') {
          if (!req.body.roleType || !['Conference Chair', 'Session Chair', 'Reviewer'].includes(req.body.roleType)) {
            return res.status(400).json({
              success: false,
              message: 'Role type is required and must be one of: Conference Chair, Session Chair, Reviewer'
            });
          }
        }

        if (modelKey === 'OtherService' || modelKey === 'OtherContribution') {
          if (!req.body.description || req.body.description.trim() === '') {
            return res.status(400).json({
              success: false,
              message: "Description is required"
            });
          }
        }

        if (modelKey === 'Professionalism') {
          if (req.body.rating === undefined || req.body.rating === null || isNaN(Number(req.body.rating)) || Number(req.body.rating) < 1 || Number(req.body.rating) > 5) {
            return res.status(400).json({
              success: false,
              message: "Rating is required and must be between 1 and 5"
            });
          }
        }

        const recordData = {
          ...req.body,
          facultyId: req.user._id
        };

        if (req.files && req.files.length > 0) {
          recordData.documents = req.files.map(file => {
            // Extract relative path from uploads folder
            const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
            return {
              fileName: file.filename,
              filePath: `/uploads${relativePath}`,
              originalName: file.originalname
            };
          });
        }

        const record = await Model.create(recordData);
        res.status(201).json({
          success: true,
          message: `${modelName} created successfully`,
          data: record
        });
      } catch (error) {
        console.error(`Create ${modelName} error:`, error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ 
            success: false,
            message: `Validation failed: ${validationErrors.join(', ')}`,
            error: error.message 
          });
        }

        res.status(400).json({ 
          success: false,
          message: `Error creating ${modelName}`, 
          error: error.message 
        });
      }
    },

    update: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ 
            success: false,
            message: `${modelName} not found` 
          });
        }

        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ 
            success: false,
            message: 'Not authorized to update this record' 
          });
        }

        // Apply same validation as create
        const modelKey = Model.modelName;

        if (modelKey === 'UGGuidance' || modelKey === 'MastersGuidance') {
          if (req.body.numberOfStudents !== undefined && req.body.numberOfStudents !== null && req.body.numberOfStudents !== '' && (isNaN(Number(req.body.numberOfStudents)) || Number(req.body.numberOfStudents) < 0)) {
            return res.status(400).json({
              success: false,
              message: 'Number of students must be greater than or equal to 0'
            });
          }
        }

        if (modelKey === 'PhDGuidance') {
          if (req.body.numberOfScholars !== undefined && req.body.numberOfScholars !== null && req.body.numberOfScholars !== '' && (isNaN(Number(req.body.numberOfScholars)) || Number(req.body.numberOfScholars) < 0)) {
            return res.status(400).json({
              success: false,
              message: 'Number of scholars must be greater than or equal to 0'
            });
          }
          if (req.body.status && !['Ongoing', 'Completed', 'Submitted'].includes(req.body.status)) {
            return res.status(400).json({
              success: false,
              message: 'Status must be one of: Ongoing, Completed, Submitted'
            });
          }
        }

        const updateData = req.body;

        if (req.files && req.files.length > 0) {
          const newDocuments = req.files.map(file => {
            // Extract relative path from uploads folder
            const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
            return {
              fileName: file.filename,
              filePath: `/uploads${relativePath}`,
              originalName: file.originalname
            };
          });
          updateData.documents = [...(record.documents || []), ...newDocuments];
        }

        const updatedRecord = await Model.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        );

        res.json({
          success: true,
          message: `${modelName} updated successfully`,
          data: updatedRecord
        });
      } catch (error) {
        console.error(`Update ${modelName} error:`, error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ 
            success: false,
            message: `Validation failed: ${validationErrors.join(', ')}`,
            error: error.message 
          });
        }

        res.status(400).json({ 
          success: false,
          message: `Error updating ${modelName}`, 
          error: error.message 
        });
      }
    },

    deleteRecord: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ 
            success: false,
            message: `${modelName} not found` 
          });
        }

        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ 
            success: false,
            message: 'Not authorized to delete this record' 
          });
        }

        await Model.findByIdAndDelete(req.params.id);
        res.json({ 
          success: true,
          message: `${modelName} deleted successfully` 
        });
      } catch (error) {
        console.error(`Delete ${modelName} error:`, error);
        res.status(500).json({ 
          success: false,
          message: `Error deleting ${modelName}`, 
          error: error.message 
        });
      }
    }
  };
};

module.exports = createController;
