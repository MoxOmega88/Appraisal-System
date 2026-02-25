/**
 * FDP Organized Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const FDPOrganized = require('../models/FDPOrganized');
const { protect } = require('../middleware/authMiddleware');
// no proof upload for FDP Organized

const controller = createController(FDPOrganized, 'FDP Organized');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
