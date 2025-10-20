const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiController = require('../controllers/aiController');

router.get('/insights', auth, aiController.getInsightsForUser);

module.exports = router;
