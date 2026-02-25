/**
 * Funded Project Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const FundedProject = require('../models/FundedProject');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const controller = createController(FundedProject, 'Funded Project');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
