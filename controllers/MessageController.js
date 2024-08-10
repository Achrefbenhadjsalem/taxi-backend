const Message = require('../models/Message');
const User = require('../models/User');
const sequelize = require('../config'); // Assurez-vous d'importer sequelize ici

exports.sendMessage = async (req, res) => {
    const { content, receiverId } = req.body;
    const senderId = req.userId;

    try {
        const message = await Message.create({
            content,
            senderId,
            receiverId
        });

        res.status(201).json({ message: 'Message sent', message });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

exports.getMessages = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.findAll({
            where: {
                [sequelize.Op.or]: [
                    { senderId: req.userId, receiverId: userId },
                    { senderId: userId, receiverId: req.userId }
                ]
            },
            include: [
                { model: User, as: 'Sender', attributes: ['id', 'username'] },
                { model: User, as: 'Receiver', attributes: ['id', 'username'] }
            ]
        });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};
