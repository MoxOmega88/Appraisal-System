const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateFinalReport } = require('../controllers/finalReportController');

/**
 * @route   GET /api/generate-final-report/:termId
 * @desc    Generate final ZIP report with PDF and all uploaded files
 * @access  Private
 */
router.get('/:termId', protect, generateFinalReport);

module.exports = router;
