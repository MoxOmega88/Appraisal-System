/**
 * Term Controller
 * Handles term/period management
 */

const Term = require('../models/Term');

// @desc    Get all terms for logged-in faculty
// @route   GET /api/terms
// @access  Private
const getTerms = async (req, res) => {
  try {
    const terms = await Term.find({ facultyId: req.user._id }).sort({ startDate: -1 });
    res.json(terms);
  } catch (error) {
    console.error('Get terms error:', error);
    res.status(500).json({ message: 'Error fetching terms', error: error.message });
  }
};

// @desc    Get single term by ID
// @route   GET /api/terms/:id
// @access  Private
const getTermById = async (req, res) => {
  try {
    const term = await Term.findById(req.params.id);

    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    // Verify ownership
    if (term.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this term' });
    }

    res.json(term);
  } catch (error) {
    console.error('Get term by ID error:', error);
    res.status(500).json({ message: 'Error fetching term', error: error.message });
  }
};

// @desc    Create new term
// @route   POST /api/terms
// @access  Private
const createTerm = async (req, res) => {
  try {
    const termData = {
      ...req.body,
      facultyId: req.user._id
    };

    const term = await Term.create(termData);
    res.status(201).json(term);
  } catch (error) {
    console.error('Create term error:', error);
    res.status(400).json({ message: 'Error creating term', error: error.message });
  }
};

// @desc    Update term
// @route   PUT /api/terms/:id
// @access  Private
const updateTerm = async (req, res) => {
  try {
    const term = await Term.findById(req.params.id);

    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    // Verify ownership
    if (term.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this term' });
    }

    const updatedTerm = await Term.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTerm);
  } catch (error) {
    console.error('Update term error:', error);
    res.status(400).json({ message: 'Error updating term', error: error.message });
  }
};

// @desc    Delete term
// @route   DELETE /api/terms/:id
// @access  Private
const deleteTerm = async (req, res) => {
  try {
    const term = await Term.findById(req.params.id);

    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    // Verify ownership
    if (term.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this term' });
    }

    await Term.findByIdAndDelete(req.params.id);
    res.json({ message: 'Term deleted successfully' });
  } catch (error) {
    console.error('Delete term error:', error);
    res.status(500).json({ message: 'Error deleting term', error: error.message });
  }
};

module.exports = {
  getTerms,
  getTermById,
  createTerm,
  updateTerm,
  deleteTerm
};