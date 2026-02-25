/**
 * Event Outside Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const EventOutside = require('../models/EventOutside');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../uploads/proofs/UploadMiddleware');

const controller = createController(EventOutside, 'Event Outside');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('proof'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('proof'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
