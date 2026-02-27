/**
 * Disclosure Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const Disclosure = require('../models/Disclosure');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
// file upload supported for Disclosure (handled by genericController)

const controller = createController(Disclosure, 'Disclosure');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
