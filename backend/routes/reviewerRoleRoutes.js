/**
 * Reviewer Role Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const ReviewerRole = require('../models/ReviewerRole');
const { protect } = require('../middleware/authMiddleware');

const controller = createController(ReviewerRole, 'Reviewer Role');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
