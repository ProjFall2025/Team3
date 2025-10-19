const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// @route   POST /api/comment/
// @desc    Create a comment
// @access  Private
router.post('/', auth, commentController.create);

// @route   POST /api/comment/like
// @desc    Like a comment
// @access  Private
router.post('/like', auth, commentController.like);

// @route   PATCH /api/comment/:id
// @desc    Update a comment
// @access  Private
router.patch('/:id', auth, commentController.update);

// @route   DELETE /api/comment/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, commentController.delete);

module.exports = router;