/**
 * Term Routes
 */

const express = require('express');
const router = express.Router();
const { getTerms, getTermById, createTerm, updateTerm, deleteTerm } = require('../controllers/termController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTerms)
  .post(protect, createTerm);

router.route('/:id')
  .get(protect, getTermById)
  .put(protect, updateTerm)
  .delete(protect, deleteTerm);

module.exports = router;
