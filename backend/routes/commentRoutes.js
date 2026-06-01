const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

// Get comments for an event (Public access)
router.get('/event/:eventId', commentController.getComments);

// Post a comment on an event (Auth required)
router.post('/event/:eventId', auth, commentController.createComment);

// Delete a comment (Auth required)
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;
