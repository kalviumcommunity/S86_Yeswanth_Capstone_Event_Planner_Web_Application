const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  isAttending: {
    type: Boolean,
    default: false
  }
});

const Guest = mongoose.model('Guest', guestSchema);
module.exports = Guest;
