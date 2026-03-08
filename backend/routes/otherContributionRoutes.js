/**
 * Other Contribution Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const OtherContribution = require('../models/OtherContribution');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const controller = createController(OtherContribution, 'Other Contribution');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.array('documents', 10), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.array('documents', 10), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
