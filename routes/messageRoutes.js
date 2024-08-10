const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');
const { authenticate } = require('../middleware/auth'); // Assurez-vous que le chemin est correct

router.post('/', authenticate, messageController.sendMessage);
router.get('/userId', authenticate, messageController.getMessages);

module.exports = router;
