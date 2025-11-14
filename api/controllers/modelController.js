const Model = require('../models/Model');

const modelsController = {
  getAllModels: async (req, res) => {
    try {
      const models = await Model.getAll();
      res.status(201).json(models);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  loadModel: async (req, res) => {
    try {
      const model = await Model.getModel(req.body)
      if (!model) return res.status(404).json({ message: 'No model found' });
      return res.status(200).json({ model: model })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
};

module.exports = modelsController;