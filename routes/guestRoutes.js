const express = require("express");
const router = express.Router();
const { getGuests, addGuest } = require("../controller/guestController");

router.get("/guests", getGuests);
router.post("/guests", addGuest);

module.exports = router;
