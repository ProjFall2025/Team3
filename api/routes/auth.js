const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/validate/user
// @desc    Validate username/email
// @access  Public
router.post('/validate/user', authController.validateUser);

// @route   POST /api/auth/validate/password
// @desc    Validate password
// @access  Public
router.post('/validate/password', authController.validatePassword);

// @route   GET /api/auth/profile/:id
// @desc    Get user profile
// @access  Private
router.get('/profile/:id', auth, authController.getProfile);

module.exports = router;