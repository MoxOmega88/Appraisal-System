/**
 * Book Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const Book = require('../models/Book');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const controller = createController(Book, 'Book');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
