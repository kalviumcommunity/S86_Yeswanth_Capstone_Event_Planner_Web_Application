const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Guest', guestSchema);
