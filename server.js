const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config');
const userRoutes = require('./routes/userRoutes');
const Stripe = require('stripe');
const axios = require('axios');

const stripe = Stripe('your_stripe_secret_key'); // Replace with your Stripe secret key

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', userRoutes);

// Payment Intent Endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Map Route and Fare Calculation Endpoint
app.post('/api/calculate-fare', async (req, res) => {
  const { startLocation, endLocation } = req.body;
  const apiKey = 'your_openrouteservice_api_key'; // Replace with your OpenRouteService API key
  const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLocation}&end=${endLocation}`;
  
  try {
    const response = await axios.get(apiUrl);
    const distanceInMeters = response.data.routes[0].summary.distance;
    const distanceInKilometers = distanceInMeters / 1000;
    const fare = distanceInKilometers * 10; // 10 dollars per kilometer
    res.json({ distance: distanceInKilometers, fare });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
