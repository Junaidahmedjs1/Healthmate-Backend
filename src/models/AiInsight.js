const mongoose = require('mongoose');

const AiInsightSchema = new mongoose.Schema({
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String },
  romanUrduSummary: { type: String },
  questionsForDoctor: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiInsight', AiInsightSchema);
