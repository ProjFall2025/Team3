const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController');
const auth = require('../middleware/auth');

// @route   POST /api/sheet/
// @desc    Create a sheet
// @access  Public
router.post('/', sheetController.create);

// @route   POST /api/sheet/rate
// @desc    Rate a sheet
// @access  Private
router.post('/rate', auth, sheetController.rate);

// @route   GET /api/sheet/:id/comments
// @desc    Get comments for sheet
// @access  Public
router.get('/:id/comments', sheetController.getComments);

// @route   GET /api/sheet/averages
// @desc    View sheets with their averages
// @access  Public
router.get('/averages', sheetController.getAverages);

// @route   GET /api/sheet/topten/downloads
// @desc    View top ten sheets by number of downloads
// @access  Public
router.get('/topten/downloads', sheetController.getTopTenDownloads);

// @route   GET /api/sheet/topten/averages
// @desc    View top ten sheets by average
// @access  Public
router.get('/topten/averages', sheetController.getTopTenAverages);

// @route   GET /api/sheet/:id
// @desc    Get a sheet
// @access  Private
router.get('/:id', auth, sheetController.getById);

// @route   PATCH /api/sheet/:id
// @desc    Update a sheet
// @access  Private
router.patch('/:id', auth, sheetController.update);

// @route   DELETE /api/sheet/:id
// @desc    Delete a sheet
// @access  Private
router.delete('/:id', auth, sheetController.delete);

module.exports = router;