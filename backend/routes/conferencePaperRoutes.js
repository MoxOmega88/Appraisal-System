/**
 * Conference Paper Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const ConferencePaper = require('../models/ConferencePaper');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const controller = createController(ConferencePaper, 'Conference Paper');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
