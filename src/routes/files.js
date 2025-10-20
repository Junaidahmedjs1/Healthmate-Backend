const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fileController = require('../controllers/fileController');

router.post('/upload', auth, fileController.uploadMiddleware, fileController.uploadFile);
router.get('/', auth, fileController.listFiles);
router.get('/:id', auth, fileController.getFile);

module.exports = router;
