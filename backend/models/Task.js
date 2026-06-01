const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  category: { type: String, default: 'General' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
