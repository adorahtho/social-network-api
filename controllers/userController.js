const { User, Thought } = require('../models');

module.exports = {
  // GET /api/users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate('thoughts').populate('friends');
      res.status(200).json(users);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },

  // GET /api/users/:userId
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST /api/users
  async postNewUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // PUT /api/users/:userId
  async putUpdateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE /api/users/:userId
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
      // Bonus: Remove a user's associated thoughts when deleted.
      await Thought.deleteMany({ username: user.username });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST /api/users/:userId/friends/:friendId
  async postNewFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE /api/users/:userId/friends/:friendId
  async deleteFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
