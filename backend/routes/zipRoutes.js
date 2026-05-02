const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { generateZipOnly } = require('../controllers/zipController');

/**
 * @route   POST /api/generate-zip/:termId
 * @desc    Generate ZIP file with only uploaded files (no PDF) - with module selection
 * @access  Private
 */
router.post('/:termId', protect, generateZipOnly);

module.exports = router;
