const express = require('express');
const router = express.Router();
const { getAllGuests } = require('../controller/guestController');

router.get('/', getAllGuests);

module.exports = router;
