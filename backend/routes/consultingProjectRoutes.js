/**
 * Consulting Project Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const ConsultingProject = require('../models/ConsultingProject');
const { protect } = require('../middleware/authMiddleware');
// no proof upload for Consulting Projects

const controller = createController(ConsultingProject, 'Consulting Project');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
