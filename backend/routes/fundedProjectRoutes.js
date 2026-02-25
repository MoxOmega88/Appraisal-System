/**
 * Funded Project Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const FundedProject = require('../models/FundedProject');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../uploads/proofs/UploadMiddleware');

const controller = createController(FundedProject, 'Funded Project');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('proof'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('proof'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
