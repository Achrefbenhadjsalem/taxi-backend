const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController'); // Assurez-vous que ce chemin est correct

router.post('/register', userController.register);
router.post('/login', userController.login);
module.exports = router;