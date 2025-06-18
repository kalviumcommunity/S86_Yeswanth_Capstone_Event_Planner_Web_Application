const express = require('express');
const router = express.Router();
const guestController = require('../controller/guestController');

router.get('/', guestController.getGuests);
router.post('/', guestController.addGuest);
router.put('/:id', guestController.updateGuest);

module.exports = router;
