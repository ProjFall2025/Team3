const Sheet = require('../models/Sheet');

const sheetController = {
  create: async (req, res) => {
    try {
      const sheet = await Sheet.create(req.body);
      res.status(201).json(sheet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  rate: async (req, res) => {
    try {
      const rating = await Sheet.rate(req.body);
      res.status(201).json(rating);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sheet = await Sheet.getById(id);
      if (!sheet) return res.status(404).json({ message: 'Sheet not found' });
      res.status(200).json(sheet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comments = await Sheet.getComments(id);
      if (!comments || comments.length === 0) return res.status(404).json({ message: 'No comments found' });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAverages: async (req, res) => {
    try {
      const averages = await Sheet.getAverages();
      if (!averages || averages.length === 0) return res.status(404).json({ message: 'No sheets available' });
      res.status(200).json(averages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTopTenDownloads: async (req, res) => {
    try {
      const top = await Sheet.topTenDownloads();
      if (!top || top.length === 0) return res.status(404).json({ message: 'No sheets available' });
      res.status(200).json(top);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTopTenAverages: async (req, res) => {
    try {
      const top = await Sheet.topTenAverages();
      if (!top || top.length === 0) return res.status(404).json({ message: 'No sheets available' });
      res.status(200).json(top);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await Sheet.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Sheet not found or deleted' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // TODO: Allow admins to also delete anyone's sheets
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await Sheet.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Sheet not found or already deleted' });
      res.status(200).json({ message: 'Sheet deleted', sheet: deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = sheetController;