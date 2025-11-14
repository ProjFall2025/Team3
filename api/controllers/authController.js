const User = require('../models/User');

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, bio } = req.body;

      const user = await User.create({ username, email, password, bio });

      const token = User.genToken(user.id)

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  validateUser: async (req, res) => {
    try {
      const { username, email } = req.body;
      
      let user;
      if (username) user = await User.getByUsername(username);
      else          user = await User.getByEmail(email);

      if (user === void 0) {
        return res.status(401).json({ message: 'Invalid username or email.' });
      }
      if (user.is_locked === true) {
        return res.status(403).json({ error: 'This account is locked' });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  validatePassword: async (req, res) => {
    try {
      const { id, password } = req.body;

      const user = await User.getById(id);

      const correct = await User.comparePassword(password, user.password);

      if (!correct) {
        User.logAttempt(id, false, req.ip);

        if (user.num_failed_attempts === 4) {
          return res.status(403).json({ message: 'Invalid password, your account has been locked.' });
        }

        return res.status(401).json({ message: 'Invalid password' });
      }

      User.logAttempt(id, true, req.ip);
      User.updateLastLoggedIn(id, new Date());
      const token = User.genToken(id)

      res.status(200).json({ token: token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await User.getById(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;