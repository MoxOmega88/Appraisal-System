const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generatePDFReport } = require('../controllers/pdfReportController');

/**
 * @route   GET /api/generate-pdf-report/:termId
 * @desc    Generate professional PDF report
 * @access  Private
 */
router.get('/:termId', protect, generatePDFReport);

module.exports = router;
