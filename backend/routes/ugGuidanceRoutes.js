/**
 * UG Guidance Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const UGGuidance = require('../models/UGGuidance');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
// file upload supported for UG Guidance

const controller = createController(UGGuidance, 'UG Guidance');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
