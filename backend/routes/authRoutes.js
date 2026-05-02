/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, deleteUser, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/change-password', protect, changePassword); // Change password endpoint
router.get('/users', protect, getAllUsers); // Admin endpoint to get all users - PROTECTED
router.delete('/users/:id', protect, deleteUser); // Admin endpoint to delete user - PROTECTED

module.exports = router;