/**
 * Disclosure Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const Disclosure = require('../models/Disclosure');
const { protect } = require('../middleware/authMiddleware');
// no proof upload for Disclosure

const controller = createController(Disclosure, 'Disclosure');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
