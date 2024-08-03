const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { isEmail } = require('validator');

// Configurer le transporteur pour l'envoi des emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Vous pouvez utiliser d'autres services comme 'sendgrid', 'mailgun', etc.
    auth: {
        user: 'houssembaklouti06@gmail.com', // Remplacez par votre email
        pass: 'lwgn yrnx djqx waxz' // Remplacez par votre mot de passe email
    }
});

// Fonction pour enregistrer un utilisateur
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Vérifier la validité de l'email
        if (!isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, email });

        // Envoyer un email de confirmation
        const mailOptions = {
            from: 'houssembaklouti06@gmail.com', // Utilisez le même email que celui utilisé pour l'authentification
            to: email,
            subject: 'Welcome to Our App',
            text: `Hello ${username},\n\nThank you for registering at our app.\n\nBest regards,\nThe Team`
        };

        console.log('Sending email to:', email);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error in register function:', error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour se connecter
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error in login function:', error);
        res.status(500).json({ error: error.message });
    }
};
