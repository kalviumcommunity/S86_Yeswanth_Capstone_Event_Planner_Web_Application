const guestData = require("../data/guestData");

// GET controller
const getGuests = (req, res) => {
  res.json(guestData);
};

// POST controller
const addGuest = (req, res) => {
  const { name, status, type } = req.body;

  if (!name || !status || !type) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newGuest = {
    id: guestData.length + 1,
    name,
    status,
    type,
  };

  guestData.push(newGuest);
  res.status(201).json({ message: "Guest added successfully!", guest: newGuest });
};

module.exports = { getGuests, addGuest };
