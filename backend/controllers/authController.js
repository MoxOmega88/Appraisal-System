/**
 * Authentication Controller
 * Handles user registration and login
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register new faculty user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, designation, joiningDate } = req.body;

    // Validate password length
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { employeeId }] });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists with this email or employee ID' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      employeeId,
      department,
      designation,
      joiningDate
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department,
        designation: user.designation,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      // Update last login timestamp using findByIdAndUpdate to avoid password rehashing
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { lastLogin: new Date() },
        { new: true }
      );

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        employeeId: updatedUser.employeeId,
        department: updatedUser.department,
        designation: updatedUser.designation,
        lastLogin: updatedUser.lastLogin,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department,
        designation: user.designation,
        joiningDate: user.joiningDate,
        lastLogin: user.lastLogin
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Public (for now - simple admin access)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Public (for now - simple admin access)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  changePassword
};