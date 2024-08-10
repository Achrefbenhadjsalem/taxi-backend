const Trip = require('../models/Trip');
const User = require('../models/User');

// Fonction pour réserver un trajet
exports.createTrip = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation } = req.body;
        const userId = req.userId; // Assurez-vous d'avoir un moyen de récupérer l'ID de l'utilisateur connecté

        // Créer une nouvelle réservation
        const trip = await Trip.create({ pickupLocation, dropoffLocation, userId });

        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour obtenir les réservations d'un utilisateur
exports.getUserTrips = async (req, res) => {
    try {
        const userId = req.userId; // Assurez-vous d'avoir un moyen de récupérer l'ID de l'utilisateur connecté

        const trips = await Trip.findAll({ where: { userId } });

        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};