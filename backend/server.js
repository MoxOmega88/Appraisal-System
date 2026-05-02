/**
 * Faculty Appraisal Management System
 * Main Server Entry Point
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const termRoutes = require('./routes/termRoutes');
const fciScoreRoutes = require('./routes/fciScoreRoutes');
const journalPaperRoutes = require('./routes/journalPaperRoutes');
const conferencePaperRoutes = require('./routes/conferencePaperRoutes');
const nonIndexedPublicationRoutes = require('./routes/nonIndexedPublicationRoutes');
const bookRoutes = require('./routes/bookRoutes');
const disclosureRoutes = require('./routes/disclosureRoutes');
const patentRoutes = require('./routes/patentRoutes');
const ugGuidanceRoutes = require('./routes/ugGuidanceRoutes');
const mastersGuidanceRoutes = require('./routes/mastersGuidanceRoutes');
const phdGuidanceRoutes = require('./routes/phdGuidanceRoutes');
const fundedProjectRoutes = require('./routes/fundedProjectRoutes');
const consultingProjectRoutes = require('./routes/consultingProjectRoutes');
const reviewerRoleRoutes = require('./routes/reviewerRoleRoutes');
const fdpOrganizedRoutes = require('./routes/fdpOrganizedRoutes');
const invitedTalkRoutes = require('./routes/invitedTalkRoutes');
const eventOutsideRoutes = require('./routes/eventOutsideRoutes');
const eventInsideRoutes = require('./routes/eventInsideRoutes');
const industryRelationRoutes = require('./routes/industryRelationRoutes');
const institutionalServiceRoutes = require('./routes/institutionalServiceRoutes');
const otherServiceRoutes = require('./routes/otherServiceRoutes');
const awardRoutes = require('./routes/awardRoutes');
const professionalismRoutes = require('./routes/professionalismRoutes');
const otherContributionRoutes = require('./routes/otherContributionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const finalReportRoutes = require('./routes/finalReportRoutes');
const zipRoutes = require('./routes/zipRoutes');
const pdfReportRoutes = require('./routes/pdfReportRoutes');
const dataSummaryRoutes = require('./routes/dataSummaryRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected Successfully');
  
  // Fix Professionalism index to allow multiple entries per term (silent)
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('professionalisms');
    
    // Get all existing indexes
    const indexes = await collection.indexes();
    
    // Drop all unique indexes
    for (const index of indexes) {
      if (index.name !== '_id_' && index.unique) {
        try {
          await collection.dropIndex(index.name);
        } catch (err) {
          // Silent
        }
      }
    }
    
    // Drop specific problematic indexes by name
    const indexesToDrop = ['facultyId_1_termId_1', 'termId_1'];
    for (const indexName of indexesToDrop) {
      try {
        await collection.dropIndex(indexName);
      } catch (err) {
        // Silent
      }
    }
    
    // Recreate proper non-unique index
    await collection.createIndex({ facultyId: 1, termId: 1 });
  } catch (err) {
    // Silent - only log if there's a critical error
    if (err.message.includes('connection')) {
      console.log('⚠️  Database index check failed:', err.message);
    }
  }
})
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/fci-scores', fciScoreRoutes);
app.use('/api/journal-papers', journalPaperRoutes);
app.use('/api/conference-papers', conferencePaperRoutes);
app.use('/api/non-indexed-publications', nonIndexedPublicationRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/disclosures', disclosureRoutes);
app.use('/api/patents', patentRoutes);
app.use('/api/ug-guidance', ugGuidanceRoutes);
app.use('/api/masters-guidance', mastersGuidanceRoutes);
app.use('/api/phd-guidance', phdGuidanceRoutes);
app.use('/api/funded-projects', fundedProjectRoutes);
app.use('/api/consulting-projects', consultingProjectRoutes);
app.use('/api/reviewer-roles', reviewerRoleRoutes);
app.use('/api/fdp-organized', fdpOrganizedRoutes);
app.use('/api/invited-talks', invitedTalkRoutes);
app.use('/api/events-outside', eventOutsideRoutes);
app.use('/api/events-inside', eventInsideRoutes);
app.use('/api/industry-relations', industryRelationRoutes);
app.use('/api/institutional-services', institutionalServiceRoutes);
app.use('/api/other-services', otherServiceRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/professionalism', professionalismRoutes);
app.use('/api/other-contributions', otherContributionRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/generate-final-report', finalReportRoutes);
app.use('/api/generate-zip', zipRoutes);
app.use('/api/generate-pdf-report', pdfReportRoutes);
app.use('/api/generate-data-summary', dataSummaryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Faculty Appraisal System API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});