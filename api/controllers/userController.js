const User = require('../models/User');

const userController = {
  follow: async (req, res) => {
    try {
      const { follower, followee } = req.body;
      if (!follower || !followee) {
        return res.status(400).json({ message: 'follower and followee are required' });
      }
      const result = await User.follow(parseInt(follower), parseInt(followee));
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await User.getById(id);
      if (!user) return res.status(404).json({ message: 'No user found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFollowing: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const following = await User.getFollowing(id);
      if (!following || following.length === 0) return res.status(404).json({ message: 'No following found' });
      res.status(200).json(following);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSheets: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sheets = await User.getSheets(id);
      if (!sheets || sheets.length === 0) return res.status(404).json({ message: 'This user has no sheets.' });
      res.status(200).json(sheets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comments = await User.getComments(id);
      if (!comments || comments.length === 0) return res.status(404).json({ message: 'This user has no comments' });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  makeAdmin: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await User.makeAdmin(id);
      if (!user) return res.status(404).json({ message: 'No user found' });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await User.delete(id);
      if (!deleted) return res.status(404).json({ message: 'User not found or already deleted' });
      res.status(200).json({ message: 'Sheet deleted', sheet: deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;