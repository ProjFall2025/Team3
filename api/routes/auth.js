const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   GET /api/auth/validate/user
// @desc    Validate username/email
// @access  Public
router.get('/validate/user', authController.validateUser);

// @route   GET /api/auth/validate/password
// @desc    Validate password
// @access  Public
router.get('/validate/password', authController.validatePassword);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, authController.getProfile);

module.exports = router;