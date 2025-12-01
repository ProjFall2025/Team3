const User = require('../models/User');

const userController = {
  follow: async (req, res) => {
    try {
      const { follower, followee } = req.body;
      if (!follower || !followee) {
        return res.status(400).json({ message: 'follower and followee are required' });
      }
      const result = await User.follow((follower), (followee));
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.getById(id);
      if (!user) return res.status(404).json({ message: 'No user found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFollowing: async (req, res) => {
    try {
      const id = req.params.id;
      const following = await User.getFollowing(id);
      if (!following || following.length === 0) return res.status(404).json({ message: 'No following found' });
      res.status(200).json(following);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFollowers: async (req, res) => {
    try {
      const id = req.params.id;
      const followers = await User.getFollowers(id);
      if (!followers || followers.length === 0) return res.status(404).json({ message: 'No followers found' });
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSheets: async (req, res) => {
    try {
      const id = req.params.id;
      const sheets = await User.getSheets(id);
      if (!sheets || sheets.length === 0) return res.status(404).json({ message: 'This user has no sheets.' });
      res.status(200).json(sheets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const id = (req.params.id);
      const comments = await User.getComments(id);
      if (!comments || comments.length === 0) return res.status(404).json({ message: 'This user has no comments' });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  makeAdmin: async (req, res) => {
    try {
      const id = (req.params.id);
      const user = await User.makeAdmin(id);
      if (!user) return res.status(404).json({ message: 'No user found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  unlock: async(req, res) => {
    try{
      const id = (req.params.id);
      const user = await User.unlock(id);
      if (!user) return res.status(404).json({ message: 'No user found' });
      res.status(200).json(user);
    }catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const updated = await User.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'User not found or deleted' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // MARK: Note - due to soft deletion, deleted records do not return anything.
  // TODO: Allow admins to also delete anyone's user
  delete: async (req, res) => {
    try {
      const id = (req.params.id);
      await User.delete(id);
      return res.status(200).json({ message: 'User deleted or not found'});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;