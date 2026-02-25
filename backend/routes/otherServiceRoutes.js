/**
 * Other Service Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const OtherService = require('../models/OtherService');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const controller = createController(OtherService, 'Other Service');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
