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
        res.json(records);
      } catch (error) {
        console.error(`Get all ${modelName} error:`, error);
        res.status(500).json({ message: `Error fetching ${modelName}`, error: error.message });
      }
    },

    getById: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ message: `${modelName} not found` });
        }

        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to access this record' });
        }

        res.json(record);
      } catch (error) {
        console.error(`Get ${modelName} by ID error:`, error);
        res.status(500).json({ message: `Error fetching ${modelName}`, error: error.message });
      }
    },

    create: async (req, res) => {
      try {
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
        res.status(201).json(record);
      } catch (error) {
        console.error(`Create ${modelName} error:`, error);
        res.status(400).json({ 
          message: `Error creating ${modelName}`, 
          error: error.message 
        });
      }
    },

    update: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ message: `${modelName} not found` });
        }

        if (record.facultyId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to update this record' });
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

        res.json(updatedRecord);
      } catch (error) {
        console.error(`Update ${modelName} error:`, error);
        res.status(400).json({ message: `Error updating ${modelName}`, error: error.message });
      }
    },

    deleteRecord: async (req, res) => {
      try {
        const record = await Model.findById(req.params.id);

        if (!record) {
          return res.status(404).json({ message: `${modelName} not found` });
        }

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
