const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// @route   POST /api/user/follow
// @desc    Follow a user
// @access  Private
router.post('/follow', auth, userController.follow);

// @route   GET /api/user/:id/
// @desc    Get user by id
// @access  Public
router.get('/:id', userController.getById);

// @route   GET /api/user/:id/following
// @desc    Get users that :id is following
// @access  Public
router.get('/:id/following', userController.getFollowing);

// @route   GET /api/user/:id/sheets
// @desc    Get sheets for user
// @access  Public
router.get('/:id/sheets', userController.getSheets);

// @route   GET /api/user/:id/comments
// @desc    Get comments for user
// @access  Public
router.get('/:id/comments', userController.getComments);

// @route   PATCH /api/user/:id
// @desc    Update a user
// @access  Private
router.patch('/:id', userController.update);

// @route   PATCH /api/user/:id/unlock
// @desc    Unlock a user
// @access  Private (Admin only)
router.patch('/:id/unlock', auth, role('admin'), userController.unlock);

// @route   PATCH /api/user/:id/comments
// @desc    Make a user an admin
// @access  Private (Admin only)
router.patch('/:id', auth, role('admin'), userController.makeAdmin);

// @route   DELETE /api/user/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/:id', auth, role('admin'), userController.delete);

module.exports = router;