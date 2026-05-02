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

        // Debug logging (development only)
        if (process.env.NODE_ENV === 'development') {
          if (modelKey === 'UGGuidance' || modelKey === 'MastersGuidance' || modelKey === 'PhDGuidance') {
            console.log(`=== ${modelKey.toUpperCase()} CREATE DEBUG ===`);
            console.log('REQ BODY:', req.body);
            console.log('Students/Scholars field:', req.body.students || req.body.scholars);
            console.log('Type:', typeof (req.body.students || req.body.scholars));
          }

          if (modelKey === 'ReviewerRole') {
            console.log('=== REVIEWER ROLE CREATE DEBUG ===');
            console.log('REQ BODY:', req.body);
            console.log('Type:', req.body.type);
            console.log('Quartile:', req.body.quartile);
            console.log('Conference Details:', req.body.conferenceDetails);
          }
        }

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

        if (modelKey === 'OtherService') {
          if (!req.body.serviceName || req.body.serviceName.trim() === '') {
            return res.status(400).json({
              success: false,
              message: "Service name is required"
            });
          }
        }

        const recordData = {
          ...req.body,
          facultyId: req.user._id
        };

        // Handle students array for UGGuidance or MastersGuidance - parse JSON string
        if ((modelKey === 'UGGuidance' || modelKey === 'MastersGuidance') && req.body.students) {
          try {
            recordData.students = typeof req.body.students === 'string' 
              ? JSON.parse(req.body.students) 
              : req.body.students;
            console.log(`${modelKey} - Parsed students:`, recordData.students);
          } catch (e) {
            console.error(`${modelKey} - Error parsing students:`, e);
            return res.status(400).json({
              success: false,
              message: 'Invalid students data format'
            });
          }
        }

        // Handle scholars array for PhDGuidance - parse JSON string
        if (modelKey === 'PhDGuidance' && req.body.scholars) {
          try {
            recordData.scholars = typeof req.body.scholars === 'string' 
              ? JSON.parse(req.body.scholars) 
              : req.body.scholars;
            console.log(`${modelKey} - Parsed scholars:`, recordData.scholars);
          } catch (e) {
            console.error(`${modelKey} - Error parsing scholars:`, e);
            return res.status(400).json({
              success: false,
              message: 'Invalid scholars data format'
            });
          }
        }

        // Handle conditional fields for ReviewerRole AFTER recordData is created
        if (modelKey === 'ReviewerRole') {
          if (req.body.type === 'Journal') {
            recordData.quartile = req.body.quartile || '';
            recordData.conferenceDetails = '';
          } else if (req.body.type === 'Conference') {
            recordData.conferenceDetails = req.body.conferenceDetails || '';
            recordData.quartile = '';
          } else {
            recordData.quartile = '';
            recordData.conferenceDetails = '';
          }
        }

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
        
        // Debug log (development only)
        if (process.env.NODE_ENV === 'development') {
          if (modelKey === 'UGGuidance' || modelKey === 'MastersGuidance' || modelKey === 'PhDGuidance') {
            console.log('Created record:', record);
            console.log('Created record students/scholars:', record.students || record.scholars);
            console.log('=== END DEBUG ===');
          }
        }
        
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

        // Handle students array for UGGuidance or MastersGuidance - parse JSON string
        if ((modelKey === 'UGGuidance' || modelKey === 'MastersGuidance') && req.body.students) {
          try {
            updateData.students = typeof req.body.students === 'string' 
              ? JSON.parse(req.body.students) 
              : req.body.students;
          } catch (e) {
            return res.status(400).json({
              success: false,
              message: 'Invalid students data format'
            });
          }
        }

        // Handle scholars array for PhDGuidance - parse JSON string
        if (modelKey === 'PhDGuidance' && req.body.scholars) {
          try {
            updateData.scholars = typeof req.body.scholars === 'string' 
              ? JSON.parse(req.body.scholars) 
              : req.body.scholars;
          } catch (e) {
            return res.status(400).json({
              success: false,
              message: 'Invalid scholars data format'
            });
          }
        }

        // Handle conditional fields for ReviewerRole in update
        if (modelKey === 'ReviewerRole') {
          if (req.body.type === 'Journal') {
            updateData.quartile = req.body.quartile || '';
            updateData.conferenceDetails = '';
          } else if (req.body.type === 'Conference') {
            updateData.conferenceDetails = req.body.conferenceDetails || '';
            updateData.quartile = '';
          } else {
            updateData.quartile = '';
            updateData.conferenceDetails = '';
          }
        }

        // Remove documents from updateData if it's coming from form (not file upload)
        // This prevents the "[object Object]" error
        if (updateData.documents && typeof updateData.documents === 'string') {
          delete updateData.documents;
        }

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
          // REPLACE old documents with new ones instead of appending
          updateData.documents = newDocuments;
        }

        const updatedRecord = await Model.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        );

        // Debug logging (development only)
        if (process.env.NODE_ENV === 'development' && modelKey === 'ReviewerRole') {
          console.log('UPDATED RECORD:', updatedRecord);
          console.log('=== END DEBUG ===');
        }

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
