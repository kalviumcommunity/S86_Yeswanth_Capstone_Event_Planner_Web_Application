const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, default: 'Catering' },
  contact: { type: String, default: 'N/A' },
  cost: { type: Number, default: 0 },
  status: { type: String, default: 'Inquired' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
