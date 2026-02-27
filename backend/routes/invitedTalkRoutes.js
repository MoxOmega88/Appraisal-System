/**
 * Invited Talk Routes
 */

const express = require('express');
const router = express.Router();
const createController = require('../controllers/genericController');
const InvitedTalk = require('../models/InvitedTalk');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
// file upload supported for Invited Talks

const controller = createController(InvitedTalk, 'Invited Talk');

router.route('/')
  .get(protect, controller.getAll)
  .post(protect, upload.single('file'), controller.create);

router.route('/:id')
  .get(protect, controller.getById)
  .put(protect, upload.single('file'), controller.update)
  .delete(protect, controller.deleteRecord);

module.exports = router;
