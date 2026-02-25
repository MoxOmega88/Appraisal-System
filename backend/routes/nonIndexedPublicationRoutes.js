/**
 * Non-Indexed Publication Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const NonIndexedPublication = require('../models/NonIndexedPublication');
const { protect } = require('../middleware/authMiddleware');
// no proof upload for Non-Indexed Publications

const controller = createController(NonIndexedPublication, 'Non-Indexed Publication');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
