const express = require('express');
const router = express.Router();
const guestController = require('../controller/guestController');

// Make sure each of these functions exists and is exported
router.get('/', guestController.getGuests);
router.post('/', guestController.addGuest);
router.put('/:id', guestController.updateGuest);

module.exports = router;
