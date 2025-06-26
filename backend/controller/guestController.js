const Guest = require('../models/Guest');

exports.getGuests = async (req, res) => {
  const guests = await Guest.find();
  res.json(guests);
};

exports.addGuest = async (req, res) => {
  const { name, email } = req.body;
  const guest = new Guest({ name, email });
  await guest.save();
  res.status(201).json(guest);
};

exports.updateGuest = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const updated = await Guest.findByIdAndUpdate(id, { name, email }, { new: true });
  res.json(updated);
};
