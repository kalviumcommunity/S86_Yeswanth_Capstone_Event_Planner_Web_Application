const express = require('express');
const router = express.Router();
const guestController = require('../controller/guestController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Make sure each of these functions exists and is exported
router.get('/', auth, authorize(['organizer']), guestController.getGuests);
router.post('/', auth, authorize(['organizer']), guestController.addGuest);
router.put('/:id', auth, authorize(['organizer']), guestController.updateGuest);
router.delete('/:id', auth, authorize(['organizer']), guestController.deleteGuest);

module.exports = router;
