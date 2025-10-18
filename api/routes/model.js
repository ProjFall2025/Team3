const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

// @route   get /api/model/
// @desc    Get all models
// @access  Public
router.get('/', modelController.getAllModels);

module.exports = router;