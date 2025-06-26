const express = require('express');
const router = express.Router();
const { getGuests, addGuest, updateGuest } = require('../controller/guestController');

router.get('/', getGuests);
router.post('/', addGuest);
router.put('/:id', updateGuest);

module.exports = router;
