/**
 * Data Summary Routes
 */

const express = require('express');
const router = express.Router();
const { generateDataSummary } = require('../controllers/dataSummaryController');
const { protect } = require('../middleware/authMiddleware');

// Generate data summary PDF for a term (supports custom field selection)
router.post('/:termId', protect, generateDataSummary);

module.exports = router;
