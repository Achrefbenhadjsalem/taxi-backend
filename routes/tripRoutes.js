const express = require('express');
const router = express.Router();
const { createTrip, getUserTrips } = require('../controllers/TripController');
const { authenticate } = require('../middleware/auth'); // Middleware d'authentification

// Route pour créer une réservation
router.post('/trips', authenticate, createTrip);

// Route pour obtenir les réservations d'un utilisateur
router.get('/trips', authenticate, getUserTrips);

module.exports = router;
