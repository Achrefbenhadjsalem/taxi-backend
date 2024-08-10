const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Configurer le transporteur pour l'envoi des emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'houssembaklouti06@gmail.com', // Remplacez par votre email
        pass: 'lwgn yrnx djqx waxz' // Remplacez par votre mot de passe email
    }
});

exports.sendContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Enregistrer les informations de contact dans la base de données
        const contact = await Contact.create({ name, email, message });

        // Envoyer un email de confirmation
        const mailOptions = {
            from: 'houssembaklouti06@gmail.com', // Utilisez le même email que celui utilisé pour l'authentification
            to: email,
            subject: 'Contact Us Confirmation',
            text: `Hello ${name},\n\nThank you for reaching out to us. We have received your message:\n\n"${message}"\n\nBest regards,\nThe Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
        });

        res.status(201).json({ message: 'Contact information saved and email sent successfully.' });
    } catch (error) {
        console.error('Error in sendContact function:', error);
        res.status(500).json({ error: error.message });
    }
};
