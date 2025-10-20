const mongoose = require('mongoose');

const VitalsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['BP','Sugar','Weight','Other'], default: 'Other' },
  value: { type: String, required: true },
  notes: { type: String },
  takenAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vitals', VitalsSchema);
