const AiInsight = require('../models/AiInsight');

exports.getInsightsForUser = async (req, res) => {
  try {
    const insights = await AiInsight.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(insights);
  } catch (err) {
    console.error('AI insights error:', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
};
