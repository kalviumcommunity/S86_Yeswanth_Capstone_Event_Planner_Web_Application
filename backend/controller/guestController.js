const Guest = require('../models/Guest');

exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addGuest = async (req, res) => {
  try {
    const { name, email } = req.body;
    const guest = new Guest({ name, email });
    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByIdAndUpdate(id, req.body, { new: true });
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
