/**
 * Award Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const Award = require('../models/Award');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const controller = createController(Award, 'Award');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;

