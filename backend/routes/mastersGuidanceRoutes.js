/**
 * Masters Guidance Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const MastersGuidance = require('../models/MastersGuidance');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
// file upload supported for Masters Guidance

const controller = createController(MastersGuidance, 'Masters Guidance');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.array('documents', 10), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.array('documents', 10), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
