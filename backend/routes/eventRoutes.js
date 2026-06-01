const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

router.get('/', eventController.getEvents);
router.post('/', auth, authorize(['organizer']), upload.single('image'), eventController.createEvent);
router.get('/:id', eventController.getEvent);
router.put('/:id', auth, authorize(['organizer']), upload.single('image'), eventController.updateEvent);
router.delete('/:id', auth, authorize(['organizer']), eventController.deleteEvent);
router.post('/:id/rsvp', auth, eventController.rsvp);

module.exports = router;
