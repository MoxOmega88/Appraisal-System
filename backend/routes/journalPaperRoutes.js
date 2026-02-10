/**
 * Journal Paper Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const JournalPaper = require('../models/JournalPaper');
const { protect } = require('../middleware/authMiddleware');

const controller = createController(JournalPaper, 'Journal Paper');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
