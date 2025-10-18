const Model = require('../models/Model');

const modelsController = {
  getAllModels: async (req, res) => {
    try {
      const models = await Model.getAll();
      res.status(201).json(models);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = modelsController;