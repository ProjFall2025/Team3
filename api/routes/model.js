const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

// @route   get /api/model/
// @desc    Get all models
// @access  Public
router.get('/', modelController.getAllModels);

// @route   post /api/model/load
// @desc    load one model by file path
// @access  Public
router.post('/load', modelController.loadModel);

module.exports = router;