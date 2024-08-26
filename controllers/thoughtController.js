const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find() // Find all thoughts in the db
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get one thought
  getSingleThought(req, res) {
    Thought.findById(req.params.thoughtId) // Find a thought by ID
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findByIdAndUpdate(
          req.body.userId,
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      // Update associated user
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought created, but found no user with that ID',
            })
          : res.json('Created the thought 🎉')
      )
      .catch((err) => res.status(500).json(err));
  },
  // Update thought
  updateThought(req, res) {
    Thought.findByIdAndUpdate( // Use ID to find the thought
      req.params.thoughtId,
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete thought
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.thoughtId) // Use ID to find the thought
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : User.findByIdAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      // Update associated user
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought deleted but no user with this id!' })
          : res.json({ message: 'Thought successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a new reaction
  addReaction(req, res) {
    Thought.findByIdAndUpdate( 
      req.params.thoughtId, // Id of the thought to update
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove a reaction
  removeReaction(req, res) {
    Thought.updateOne(
      { _id: req.params.thoughtId }, // Id of the thought to update
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((result) => {
        if (result.nModified === 0) {
          return res.status(404).json({ message: 'No reaction removed or thought not found!' });
        }
        res.json({ message: 'Reaction successfully removed!' });
      })
      .catch((err) => {
        console.error("Error removing reaction:", err);
        res.status(500).json(err);
      });
  }
};