const Comment = require('../models/Comment');
const Event = require('../models/Event');

// Fetch all comments for a specific event
exports.getComments = async (req, res) => {
  try {
    const { eventId } = req.params;
    const comments = await Comment.find({ event: eventId })
      .populate('user', 'username email')
      .sort({ createdAt: 1 }); // Oldest first (chronological message thread)
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Fetch comments error', error: err.message });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    // Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const comment = new Comment({
      event: eventId,
      user: req.userId,
      text: text.trim()
    });

    await comment.save();
    
    // Populate user before sending back
    await comment.populate('user', 'username email');

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Create comment error', error: err.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Retrieve the associated event to verify the event host
    const event = await Event.findById(comment.event);
    
    const isCommentAuthor = comment.user.toString() === req.userId;
    const isEventHost = event && event.creator.toString() === req.userId;

    if (!isCommentAuthor && !isEventHost) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete comment error', error: err.message });
  }
};
