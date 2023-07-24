const { Thought, User } = require('../models');

module.exports = {
  // GET /api/thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET /api/thoughts/:thoughtId
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        res.status(404).json({ message: 'Thought not found.' });
        return;
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST /api/thoughts
  async postNewThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findByIdAndUpdate(
        req.body.userId,
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // PUT /api/thoughts/:thoughtId
  async putUpdateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
      if (!thought) {
        res.status(404).json({ message: 'Thought not found.' });
        return;
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE /api/thoughts/:thoughtId
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!thought) {
        res.status(404).json({ message: 'Thought not found.' });
        return;
      }
      // Remove the thought's _id from the associated user's thoughts array field
      await User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thought._id } });

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST /api/thoughts/:thoughtId/reactions
  async postNewReaction(req, res) {
    try {
      const reaction = { reactionBody: req.body.reactionBody, username: req.body.username };
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: reaction } },
        { new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'Thought not found.' });
        return;
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE /api/thoughts/:thoughtId/reactions/:reactionId
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'Thought not found.' });
        return;
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
