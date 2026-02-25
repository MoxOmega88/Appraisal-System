const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateZipOnly } = require('../controllers/zipController');

/**
 * @route   GET /api/generate-zip/:termId
 * @desc    Generate ZIP file with only uploaded files (no PDF)
 * @access  Private
 */
router.get('/:termId', protect, generateZipOnly);

module.exports = router;
