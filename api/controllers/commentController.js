const Comment = require('../models/Comment');

const commentController = {
  create: async (req, res) => {
    try {
      const comment = await Comment.create(req.body);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  like: async (req, res) => {
    try {
      const like = await Comment.like(req.body);
      res.status(201).json(like);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  unlike: async (req, res) => {
    try {
      const unlike = await Comment.unlike(req.body);
      res.status(201).json(unlike);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = (req.params.id);
      const { content } = req.body;
      const updated = await Comment.update(id, content, new Date());
      if (!updated) return res.status(404).json({ message: 'Comment not found or deleted' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // TODO: Maybe change the way this checks roles
  delete: async (req, res) => {
    try {
      const id = (req.params.id);

      let comment = json(await Comment.getById(id));

      const isOwner = requester.id === comment.created_by;
      const isAdmin = requester.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden: not allowed to delete this comment' });
      }

      const deleted = await Comment.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Comment not found or already deleted' });
      res.status(200).json({ message: 'Comment deleted', comment: deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = commentController;