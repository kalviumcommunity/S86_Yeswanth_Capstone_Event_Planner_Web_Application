const guests = require('../data/guestData');

const getAllGuests = (req, res) => {
  res.status(200).json({
    success: true,
    data: guests
  });
};

module.exports = { getAllGuests };
