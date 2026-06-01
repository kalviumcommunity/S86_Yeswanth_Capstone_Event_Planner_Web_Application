const Guest = require('../models/Guest');

exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ creator: req.userId }).populate('event', 'title date');
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve guests', error: err.message });
  }
};

exports.addGuest = async (req, res) => {
  try {
    const { name, email, event } = req.body;
    const guest = new Guest({ name, email, event: event || null, creator: req.userId });
    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add guest', error: err.message });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findById(id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    if (guest.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, email, event } = req.body;
    guest.name = name;
    guest.email = email;
    guest.event = event || null;
    await guest.save();

    res.json(guest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update guest', error: err.message });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findById(id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    if (guest.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await guest.deleteOne();
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete guest', error: err.message });
  }
};
