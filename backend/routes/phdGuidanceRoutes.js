/**
 * PhD Guidance Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const PhDGuidance = require('../models/PhDGuidance');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
// file upload supported for PhD Guidance

const controller = createController(PhDGuidance, 'PhD Guidance');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
