const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { isEmail } = require('validator');

// Configurer le transporteur pour l'envoi des emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'houssembaklouti06@gmail.com',
        pass: 'your_email_password'
    }
});

exports.register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        if (!isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }


        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, email, role });

        const mailOptions = {
            from: 'houssembaklouti06@gmail.com',
            to: email,
            subject: 'Welcome to Our App',
            text: `Hello ${username},\n\nThank you for registering at our app.\n\nBest regards,\nThe Team`
        };

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

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.isApproved) {
            return res.status(403).json({ error: 'Your account is not approved yet. Please wait for approval.' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        

        const token = jwt.sign({ userId: user.id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error in login function:', error);
        res.status(500).json({ error: error.message });
    }
};
