const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rsvp: { type: String, enum: ['Yes', 'No', 'Maybe'], default: 'Maybe' }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  time: String,
  location: String,
  imageUrl: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [attendeeSchema]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
