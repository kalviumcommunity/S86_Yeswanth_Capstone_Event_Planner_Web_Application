let guests = require('../data/guestData');

exports.getGuests = (req, res) => {
  res.json(guests);
};

exports.addGuest = (req, res) => {
  const { name, email } = req.body;
  const newGuest = { id: guests.length + 1, name, email };
  guests.push(newGuest);
  res.status(201).json(newGuest);
};

exports.updateGuest = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  let guest = guests.find(g => g.id == id);
  if (guest) {
    guest.name = name || guest.name;
    guest.email = email || guest.email;
    res.json(guest);
  } else {
    res.status(404).json({ message: 'Guest not found' });
  }
};
